using System.Collections.Generic;

namespace Bills.Mail.Models
{
    /// <summary>
    /// The message model
    /// </summary>
    public class MessageModel
    {
        /// <summary>
        /// The message subject
        /// </summary>
        public string Subject { get; set; }

        /// <summary>
        /// The list of files
        /// </summary>
        public IList<FileModel> Files { get; set; } = new List<FileModel>();
    }
}
