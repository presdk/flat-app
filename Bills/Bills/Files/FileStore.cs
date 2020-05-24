using System.IO;

namespace Bills.Files
{
    /// <inheritdoc />
    public class FileStore : IFileStore
    {
        private readonly string directoryPath;

        /// <summary>
        /// Constructor for the file store
        /// </summary>
        /// <param name="directoryPath">the directory path</param>
        public FileStore(string directoryPath)
        {
            this.directoryPath = directoryPath;
        }

        /// <inheritdoc />
        public void SaveFile(byte[] data, string fileName)
        {
            using (FileStream file = new FileStream(Path.Join(this.directoryPath, fileName), FileMode.Create, FileAccess.Write))
            {
                file.Write(data);
            }
        }

        /// <inheritdoc />
        public void CreateDirectory(string directoryName)
        {
            string directoryPath = Path.Join(this.directoryPath, directoryName);
            if (!Directory.Exists(directoryPath))
            {
                Directory.CreateDirectory(directoryPath);
            }
        }

        /// <inheritdoc />
        public void OpenOrCreateFile(string fileName)
        {
            string filePath = Path.Join(this.directoryPath, fileName);
            if (!File.Exists(filePath))
            {
                using (File.Create(filePath))
                {
                }
            }
        }
    }
}
