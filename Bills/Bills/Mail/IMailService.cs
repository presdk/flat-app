
using System.Collections.Generic;
using Bills.Mail.Models;

namespace Bills.Mail
{
    /// <summary>
    /// The mail service to retrieve mails and attachments from
    /// </summary>
    public interface IMailService
    {
        /// <summary>
        /// Returns the messages that match the filer query
        /// </summary>
        /// <param name="filterQuery">the filter query</param>
        /// <param name="attachmentTypes">the attachment types to include in the message</param>
        /// <returns>list of messages</returns>
        IList<MessageModel> GetMessages(string filterQuery, IList<AttachmentTypes> attachmentTypes);
    }
}
