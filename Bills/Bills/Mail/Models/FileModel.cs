using System.Diagnostics;

namespace Bills.Mail.Models
{
    /// <summary>
    /// The file model
    /// </summary>
    public class FileModel
    {
        /// <summary>
        /// Constructor for the file model
        /// </summary>
        /// <param name="attachmentType">the attachment type</param>
        /// <param name="dataInBytes">the data in bytes</param>
        public FileModel(AttachmentTypes attachmentType, byte[] dataInBytes)
        {
            Debug.Assert(attachmentType != null);
            Debug.Assert(dataInBytes != null && dataInBytes.Length > 0);

            this.AttachmentType = attachmentType;
            this.DataInBytes = dataInBytes;
        }

        /// <summary>
        /// The mime type
        /// </summary>
        public AttachmentTypes AttachmentType { get; }

        /// <summary>
        /// The data encoded in base 64
        /// </summary>
        public byte[] DataInBytes { get; }
    }
}
