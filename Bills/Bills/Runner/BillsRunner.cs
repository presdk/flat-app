using Bills.Mail;
using Bills.Mail.Models;
using System;
using System.Collections.Generic;
using System.Diagnostics;

namespace Bills.Runner
{
    /// <summary>
    /// The runner class that fetches and processes emails to generate bills via REST APIs.
    /// </summary>
    public class BillsRunner : IBillsRunner
    {
        private readonly IMailHelper mailHelper;

        /// <summary>
        /// The constructor for the bills runner
        /// </summary>
        /// <param name="mailHelper">the mail helper</param>
        public BillsRunner(IMailHelper mailHelper)
        {
            Debug.Assert(mailHelper != null);
            this.mailHelper = mailHelper;
        }

        /// <inheritdoc />
        public void Start()
        {
            DateTime today = DateTime.Now;
            Trace.WriteLine("=====================================================================");
            Trace.WriteLine($"Bills runner started on date: {today.ToLongDateString()} at time: {today.ToShortTimeString()}");

            // TODO: Download pdf for internet
            // TODO: Download pdf for water
            List<AttachmentTypes> allowedAttachmentTypes = new List<AttachmentTypes>(){AttachmentTypes.Pdf};
            this.mailHelper.DownloadMessages("subject:trustpower", allowedAttachmentTypes, "power");

            Trace.WriteLine("Runner has ended gracefully");
            Trace.WriteLine("=====================================================================");
        }
    }
}
