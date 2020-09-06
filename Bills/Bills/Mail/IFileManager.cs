using Bills.Mail.Models;

namespace Bills.Mail
{
    /// <summary>
    /// Helper class for mails
    /// </summary>
    public interface IFileManager
    {
        /// <summary>
        /// Clears all files
        /// </summary>
        void ClearAllFiles();

        /// <summary>
        /// Saves the file to local storage
        /// </summary>
        /// <param name="file">the file to save</param>
        /// <param name="folderName">the relative folder name to save to</param>
        string CopyToLocalStorage(FileModel file, string folderName);
    }
}
