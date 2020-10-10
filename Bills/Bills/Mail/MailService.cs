using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using Bills.Mail.Models;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Gmail.v1;
using Google.Apis.Gmail.v1.Data;
using Google.Apis.Services;

namespace Bills.Mail
{
    /// <inheritdoc />
    public class MailService : IMailService
    {
        private static readonly string ApplicationName = "flat";
        private const string PdfMimeType = "application/pdf";
        private const string PdfFileExtension = ".pdf";

        private readonly GmailService service;

        private MailService(GmailService service)
        {
            this.service = service;
        }

        /// <summary>
        /// Creates a mail service and connects to the server
        /// </summary>
        /// <returns></returns>
        public static MailService CreateConnection(UserCredential credential)
        {
            // Create Gmail API service.
            GmailService service = new GmailService(new BaseClientService.Initializer()
            {
                HttpClientInitializer = credential,
                ApplicationName = ApplicationName,
            });

            return new MailService(service);
        }

        /// <inheritdoc />
        public IEnumerable<MultiFileMessage> GetPdfMessagesByFilter(string filterQuery)
        {
            IList<Message> messageInfos = RetrieveMessagesInfoByFilter(filterQuery);
            if (messageInfos == null)
            {
                yield break;
            }

            foreach (Message msgInfo in messageInfos)
            {
                Message message = RetrieveMessageById(msgInfo.Id);
                if (message == null)
                {
                    continue;
                }

                MultiFileMessage multiFileMessage = new MultiFileMessage()
                {
                    Subject = GetSubjectText(message.Payload.Headers)
                };

                IList<MessagePart> parts = message.Payload.Parts;
                if (parts == null || parts.Count <= 0)
                {
                    continue;
                }

                foreach (MessagePart part in parts)
                {
                    string attachmentId = part.Body.AttachmentId;
                    if (string.IsNullOrEmpty(attachmentId))
                    {
                        continue;
                    }

                    if (!part.MimeType.Equals(PdfMimeType))
                    {
                        continue;
                    }

                    byte[] data = RetrieveFileById(msgInfo.Id, attachmentId);
                    if (data == null)
                    {
                        continue;
                    }

                    FileModel fileModel = new FileModel(part.Filename, data);
                    multiFileMessage.Files.Add(fileModel);
                }

                yield return multiFileMessage;
            }
        }

        private IList<Message> RetrieveMessagesInfoByFilter(string filterQuery)
        {
            UsersResource.MessagesResource.ListRequest request = this.service.Users.Messages.List("me");
            request.Q = filterQuery;

            ListMessagesResponse res = request.Execute();

            return res.Messages;
        }

        private Message RetrieveMessageById(string messageId)
        {
            UsersResource.MessagesResource.GetRequest msg = this.service.Users.Messages.Get("me", messageId);
            msg.Format = UsersResource.MessagesResource.GetRequest.FormatEnum.Full;

            Message retrievedMsg = msg.Execute();
            return retrievedMsg;
        }

        private byte[] RetrieveFileById(string messageId, string attachmentId)
        {
            MessagePartBody attachment = service.Users.Messages.Attachments
                .Get("me", messageId, attachmentId).Execute();

            if (attachment != null)
            {
                StringBuilder data = new StringBuilder(attachment.Data);

                // Convert from RFC 4648 base64urlsafe encoding to base64
                // see http://en.wikipedia.org/wiki/Base64#Implementations_and_history
                data.Replace('-', '+').Replace('_', '/');

                return Convert.FromBase64String(data.ToString());
            }

            Trace.WriteLine($"Failed to fetch attachment for message id: {messageId} and attachment id: {attachmentId}");
            return null;
        }

        private static string GetSubjectText(ICollection<MessagePartHeader> headers)
        {
            const string SubjectKey = "Subject";
            MessagePartHeader subjectHeader = headers.FirstOrDefault(header => header.Name.Equals(SubjectKey));

            return subjectHeader?.Value;
        }
    }
}
