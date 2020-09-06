
using System.Collections.Generic;
using Bills.DocumentParser.Models;
using Bills.Mail.Models;

namespace Bills.Mail
{
    /// <summary>
    /// The mail service to retrieve mails and attachments from
    /// </summary>
    public interface IMailService
    {
        /// <summary>
        /// Returns the messages that match the filter query
        /// </summary>
        /// <param name="filterQuery">the filter query</param>
        /// <returns>list of messages</returns>
        IEnumerable<MultiFileMessage> GetPdfMessagesByFilter(string filterQuery);
    }
}
