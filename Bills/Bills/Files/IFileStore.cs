namespace Bills.Files
{
    /// <summary>
    /// Interface for the file system
    /// </summary>
    public interface IFileStore
    {
        /// <summary>
        /// Save the data bytes as a file in the folder path
        /// </summary>
        /// <param name="data">the data</param>
        /// <param name="fileName"></param>
        void SaveFile(byte[] data, string fileName);

        /// <summary>
        /// Create directory at path if it doesn't exist
        /// </summary>
        /// <param name="directoryName">the directory path</param>
        void CreateDirectory(string directoryName);

        /// <summary>
        /// Create a file if it doesn't exist
        /// </summary>
        /// <param name="fileName">the file name</param>
        void CreateFile(string fileName);
    }
}
