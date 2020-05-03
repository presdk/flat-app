namespace Bills.Models
{
    /// <summary>
    /// The file model
    /// </summary>
    public class FileModel
    {
        /// <summary>
        /// The subject
        /// </summary>
        public string Subject { get; set; }

        /// <summary>
        /// The mime type
        /// </summary>
        public string MimeType { get; set; }

        /// <summary>
        /// The data encoded in base 64
        /// </summary>
        public byte[] DataInBytes { get; set; }
    }
}
