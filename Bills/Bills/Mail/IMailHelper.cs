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
        /// <param name="filterQuery"></param>
        /// <param name="attachmentTypes"></param>
        /// <param name="folderName">the name of the folder to save messages to</param>
        void DownloadMessages(string filterQuery, string[] attachmentTypes, string folderName);
    }
}
