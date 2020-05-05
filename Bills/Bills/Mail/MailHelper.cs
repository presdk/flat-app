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
        public void DownloadMessages(string filterQuery, string[] attachmentTypes, string folderName)
        {
            this.fileStore.CreateDirectory(folderName);

            IList<MessageModel> messages = this.mailService.GetMessages(filterQuery, attachmentTypes);

            foreach (MessageModel message in messages)
            {
                Trace.WriteLine($"Retrieved message with subject: {message.Subject}");

                foreach (FileModel file in message.Files)
                {
                    if (file.DataInBytes != null)
                    {
                        Trace.WriteLine(
                            $"\tDownloading file with subject: {file.Subject} of mime type: {file.MimeType}");
                        DownloadFile(file, folderName);
                    }
                    else
                    {
                        Trace.WriteLine(
                            $"\tFailed to download file with subject: {file.Subject} of mime type: {file.MimeType}");
                    }
                }
            }
        }

        private void DownloadFile(FileModel file, string folderPath)
        {
            try
            {
                string guid = Guid.NewGuid().ToString();
                string fileExt = GetFileExtension(file.MimeType);
                string savePath = Path.Join(folderPath, $"{guid}{fileExt}");

                this.fileStore.SaveFile(file.DataInBytes, savePath);
            }
            catch (Exception ex)
            {
                Trace.WriteLine(string.Format("Exception caught while downloading file {0}", ex));
            }
        }

        private static string GetFileExtension(string mimeType)
        {
            if (mimeType.Equals("application/pdf"))
            {
                return ".pdf";
            }
            else
            {
                //TODO support other file types if needed
                throw new NotImplementedException();
            }

            return null;
        }
    }
}
