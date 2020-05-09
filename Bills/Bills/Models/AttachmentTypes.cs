namespace Bills.Models
{
    /// <summary>
    /// The file attachment type
    /// </summary>
    public sealed class AttachmentTypes
    {
        /// <summary>
        /// The pdf attachment type
        /// </summary>
        public static AttachmentTypes Pdf = new AttachmentTypes() {MimeType = "application/pdf", FileExtension = ".pdf"};

        /// <summary>
        /// The unknown attachment type
        /// </summary>
        public static AttachmentTypes Unknown = new AttachmentTypes() {MimeType = "unknown", FileExtension = ".unknown"};

        /// <summary>
        /// The mime type name
        /// </summary>
        public string MimeType { get; set; }

        /// <summary>
        /// The file extension
        /// </summary>
        public string FileExtension { get; set; }

        /// <summary>
        /// Returns an attachment type that matches the mime type
        /// </summary>
        /// <param name="mimeType">the mime type</param>
        public static AttachmentTypes GetAttachmentTypeForMimeType(string mimeType)
        {
            if (mimeType.Equals(Pdf.MimeType))
            {
                return Pdf;
            }
            else
            {
                return Unknown;
            }
        }
    }
}
