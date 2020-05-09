using System.Collections.Generic;
using Bills.Models;

namespace Bills.Mail
{
    /// <summary>
    /// Helper class for mails
    /// </summary>
    public interface IMailHelper
    {
        /// <summary>
        /// Downloads messages according to the given strategy
        /// </summary>
        /// <param name="mailFilterQuery">the mail filter query</param>
        /// <param name="attachmentTypesFilter">the filter for attachment types</param>
        /// <param name="outputFolderName">the name of the folder to save messages to</param>
        bool DownloadMessages(string mailFilterQuery, IList<AttachmentTypes> attachmentTypesFilter, string outputFolderName);
    }
}
