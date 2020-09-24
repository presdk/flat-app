using Bills.Mail;
using Bills.Mail.Models;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using Bills.BillsServerApi;
using Bills.DocumentParser.Models;
using PDFIndexer.Utils;

namespace Bills.Runner
{
    /// <summary>
    /// The runner class that fetches and processes emails to generate bills via REST APIs.
    /// </summary>
    public class BillsRunner
    {
        private readonly IFileManager _fileManager;
        private readonly IMailService _mailService;
        private readonly IBillsServerApi _billsApi;

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

            this._fileManager = fileManager;
            this._mailService = mailService;
            this._billsApi = billsApi;
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
                this._fileManager.ClearAllFiles();
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

            IEnumerable<MultiFileMessage> messages = _mailService.GetPdfMessagesByFilter(filterQuery);
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

                    string localFilePath = _fileManager.CopyToLocalStorage(file, saveFolderName);
                    string fullText = textExtractor.ExtractFullText(localFilePath);

                    yield return BillBase.CreateBill(type, fullText);
                }
            }
        }

        private void UploadBills(IEnumerable<BillBase> bills, BillType billType)
        {
            Trace.WriteLine($"Uploading bills for type: {billType}");

            foreach (BillBase bill in bills)
            {
                Trace.WriteLine($"\tUploading bill: {bill}");

                string date = $"{bill.Day:D2}-{bill.Month:D2}-{bill.Year:D4}";
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

                CreateBillResponse billResponse = this._billsApi.CreateBill(date, type, bill.Amount);
                if (billResponse.IsSuccess)
                {
                    Trace.WriteLine("\t\t[SUCCESS]");
                }
                else
                {
                    Trace.WriteLine($"\t\t[FAILED] Reason: {billResponse.ErrorMessage}");
                }
            }

            Trace.WriteLine($"Finished uploading bills for type: {billType}");
        }
    }
}
