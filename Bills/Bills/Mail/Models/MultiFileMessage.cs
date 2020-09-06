using System.Collections.Generic;
using Lucene.Net.Util;

namespace Bills.Mail.Models
{
    /// <summary>
    /// The message model
    /// </summary>
    public class MultiFileMessage
    {
        /// <summary>
        /// The message subject
        /// </summary>
        public string Subject { get; set; }

        /// <summary>
        /// The list of files
        /// </summary>
        public IList<FileModel> Files { get; } = new List<FileModel>();
    }
}
