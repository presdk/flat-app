using Bills.Mail;
using Bills.Mail.Models;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Net;
using Bills.BillsServerApi;
using Bills.DocumentParser.Models;
using Castle.DynamicProxy.Generators.Emitters.SimpleAST;
using iText.Kernel.Pdf;
using iText.Kernel.Pdf.Canvas.Parser.Util;
using PDFIndexer.Utils;

namespace Bills.Runner
{
    /// <summary>
    /// The runner class that fetches and processes emails to generate bills via REST APIs.
    /// </summary>
    public class BillsRunner
    {
        private readonly IFileManager fileManager;
        private readonly IMailService mailService;
        private readonly IBillsServerApi billsApi;

        /// <summary>
        /// The constructor for the bills runner
        /// </summary>
        /// <param name="mailService">the mail server</param>
        /// <param name="fileManager">the mail helper</param>
        /// <param name="billsApi">the bills server api</param>
        public BillsRunner(IMailService mailService, IFileManager fileManager, IBillsServerApi billsApi)
        {
            Debug.Assert(mailService != null);
            Debug.Assert(fileManager != null);
            Debug.Assert(billsApi != null);

            this.fileManager = fileManager;
            this.mailService = mailService;
            this.billsApi = billsApi;
        }

        /// <summary>
        /// Start processing
        /// </summary>
        /// <param name="processNewOnly">true if only processing new bills</param>
        /// <param name="clearAllLocalBills">true if clearing all local bill files</param>
        public void Process(bool processNewOnly, bool clearAllLocalBills)
        {
            DateTime today = DateTime.Now;
            Trace.WriteLine("=====================================================================");
            Trace.WriteLine($"Bills runner started on date: {today.ToLongDateString()} at time: {today.ToShortTimeString()}");

            if (clearAllLocalBills)
            {
                this.fileManager.ClearAllFiles();
            }

            const string powerBillsQuery = "label:power";
            IEnumerable<MultiFileMessage> powerMessages = FetchPdfMails(powerBillsQuery, processNewOnly);

            const string waterBillsQuery = "label:water";
            IEnumerable<MultiFileMessage> waterMessages = FetchPdfMails(waterBillsQuery, processNewOnly);

            IEnumerable<BillBase> powerBills = GenerateBills(powerMessages, BillType.Power, PowerBill.FolderPath);
            IEnumerable<BillBase> waterBills = GenerateBills(waterMessages, BillType.Water, WaterBill.FolderPath);

            UploadBills(powerBills, BillType.Power);
            UploadBills(waterBills, BillType.Water);

            Trace.WriteLine("Runner has ended gracefully");
            Trace.WriteLine("=====================================================================");
        }

        private IEnumerable<MultiFileMessage> FetchPdfMails(string filterQuery, bool processNewOnly)
        {
            if (processNewOnly)
            {
                filterQuery += "-label:done";
            }

            Trace.WriteLine($"Download started for filter query: {filterQuery}...");

            IEnumerable<MultiFileMessage> messages = this.mailService.GetPdfMessagesByFilter(filterQuery);
            return messages;
        }

        private IEnumerable<BillBase> GenerateBills(IEnumerable<MultiFileMessage> messages, BillType type, string saveFolderName)
        {
            TextExtractor textExtractor = new TextExtractor();
            foreach (MultiFileMessage message in messages)
            {
                foreach (FileModel file in message.Files)
                {
                    Debug.Assert(file != null);
                    if (file == null)
                    {
                        continue;
                    }

                    string localFilePath = this.fileManager.CopyToLocalStorage(file, saveFolderName);
                    string fullText = textExtractor.ExtractFullText(localFilePath);

                    yield return BillBase.CreateBill(type, fullText);
                }
            }
        }

        private void UploadBills(IEnumerable<BillBase> bills, BillType billType)
        {
            Trace.WriteLine(string.Format("Uploading bills for type: {0}", billType.ToString()));

            foreach (BillBase bill in bills)
            {
                Trace.WriteLine(string.Format("\tUploading bill: {0}", bill));

                string date = string.Format("{0:D2}-{1:D2}-{2:D4}", bill.Day, bill.Month, bill.Year);
                string type;
                switch (bill.BillType)
                {
                    case BillType.Water:
                        type = "water";
                        break;
                    case BillType.Internet:
                        type = "internet";
                        break;
                    case BillType.Power:
                        type = "power";
                        break;
                    default:
                        Debug.Assert(false, "Unsupported type");
                        return;
                }

                CreateBillResponse billResponse = this.billsApi.CreateBill(date, type, bill.Amount);
                if (billResponse.IsSuccess)
                {
                    Trace.WriteLine("\t\t[SUCCESS]");
                }
                else
                {
                    Trace.WriteLine(string.Format("\t\t[FAILED] Reason: {0}", billResponse.ErrorMessage));
                }
            }

            Trace.WriteLine(string.Format("Finished uploading bills for type: {0}", billType.ToString()));
        }
    }
}
