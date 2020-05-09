using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using Bills.Files;
using Bills.Models;

namespace Bills.Mail
{
    /// <inheritdoc />
    public class MailHelper : IMailHelper
    {
        private readonly IMailService mailService;
        private readonly IFileStore fileStore;
        private int downloadCount;

        /// <summary>
        /// The constructor for the mail helper
        /// </summary>
        /// <param name="mailService">the mail service</param>
        /// <param name="fileStore">the file store</param>
        public MailHelper(IMailService mailService, IFileStore fileStore)
        {
            Debug.Assert(mailService != null);
            Debug.Assert(mailService != null);

            this.mailService = mailService;
            this.fileStore = fileStore;
        }

        /// <inheritdoc />
        public bool DownloadMessages(string mailFilterQuery, IList<AttachmentTypes> attachmentTypesFilter,
            string outputFolderName)
        {
            this.downloadCount = 0;

            Trace.WriteLine($"Download started for filter query: {mailFilterQuery} with attachment types: {attachmentTypesFilter}...");

            try
            {
                this.fileStore.CreateDirectory(outputFolderName);
            }
            catch (Exception ex)
            {
                Trace.WriteLine($"\tError occured creating directory at {outputFolderName} with error: {ex.Message}");
                Trace.WriteLine("Download has been stopped.");
                return false;
            }

            IList<MessageModel> messages = this.mailService.GetMessages(mailFilterQuery, attachmentTypesFilter);

            foreach (MessageModel message in messages)
            {
                Trace.WriteLine($"\tRetrieved message with subject: {message.Subject}");

                foreach (FileModel file in message.Files)
                {
                    Debug.Assert(file.DataInBytes != null);
                    if (file.DataInBytes != null)
                    {
                        Trace.WriteLine(
                            $"\t\tDownloading file of mime type: {file.AttachmentType}");
                        DownloadFile(file, outputFolderName);
                    }
                    else
                    {
                        Trace.WriteLine(
                            $"\t\tFailed to download file of mime type: {file.AttachmentType}");
                    }
                }
            }

            Trace.WriteLine($"{downloadCount} files were downloaded.");
            return true;
        }

        private void DownloadFile(FileModel file, string folderPath)
        {
            try
            {
                string guid = Guid.NewGuid().ToString();
                string fileExt = file.AttachmentType.FileExtension;
                string savePath = Path.Join(folderPath, $"{guid}{fileExt}");

                this.fileStore.SaveFile(file.DataInBytes, savePath);

                this.downloadCount++;
            }
            catch (Exception ex)
            {
                Trace.WriteLine(string.Format("Exception caught while downloading file {0}", ex));
            }
        }
    }
}
