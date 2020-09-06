using System;
using System.Diagnostics;
using System.IO;
using Bills.Mail.Models;
using Org.BouncyCastle.Bcpg.Sig;

namespace Bills.Mail
{
    /// <inheritdoc />
    public class FileManager : IFileManager
    {
        private const string FilesFolderName = "Files";

        /// <summary>
        /// The constructor for the mail helper
        /// </summary>
        public FileManager(string localStoragePath)
        {
            this.LocalStoragePath = Path.Combine(localStoragePath, FilesFolderName);
            Directory.CreateDirectory(this.LocalStoragePath);
        }

        /// <summary>
        /// The path where all files are stored
        /// </summary>
        public string LocalStoragePath { get; }

        /// <inheritdoc />
        public void ClearAllFiles()
        {
            Trace.WriteLine(string.Format("Clearing all files in folder: {0}", FilesFolderName));
            Directory.Delete(this.LocalStoragePath, true);
            Directory.CreateDirectory(this.LocalStoragePath);
        }

        /// <inheritdoc />
        public string CopyToLocalStorage(FileModel file, string folderName)
        {
            try
            {
                string fileName = string.Format("{0}{1}", Guid.NewGuid(), Path.GetExtension(file.FileName));
                string fullFileName = Path.Combine(this.LocalStoragePath, folderName, fileName);
                string directoryPath = Path.GetDirectoryName(fullFileName);
                if (!Directory.Exists(directoryPath))
                {
                    Directory.CreateDirectory(directoryPath);
                }

                using (FileStream fileStream = File.Create(fullFileName))
                {
                    fileStream.Write(file.Contents);
                }

                return fullFileName;
            }
            catch (Exception ex)
            {
                Trace.WriteLine(string.Format("Error occurred while copying file named: '{0}'. {1}", file.FileName, ex));
            }

            return null;
        }
    }
}
