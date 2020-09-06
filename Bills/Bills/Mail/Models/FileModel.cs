using System;
using System.Collections.Generic;
using System.Text;

namespace Bills.Mail.Models
{
    public class FileModel
    {
        /// <summary>
        /// the constructor for the file model
        /// </summary>
        /// <param name="fileName">the file name</param>
        /// <param name="contents">the contents in bytes</param>
        public FileModel(string fileName, byte[] contents)
        {
            this.FileName = fileName;
            this.Contents = contents;
        }

        /// <summary>
        /// The file name
        /// </summary>
        public string FileName { get; }

        /// <summary>
        /// The contents in bytes
        /// </summary>
        public byte[] Contents { get; }
    }
}
