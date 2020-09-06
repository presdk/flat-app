using System;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Threading;
using Bills.Mail;
using Bills.Runner;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Gmail.v1;
using Google.Apis.Util.Store;

namespace Bills
{
    public class Program
    {
        private const string ProcessAllFlag = "--all";
        private const string ClearAllFlag = "--clear";

        public static void Main(string[] args)
        {
            if (args.Length < 1)
            {
                Trace.WriteLine("Missing the first command line argument for pdf download path.");
                return;
            }

            string downloadDirectory = args[0];
            if (string.IsNullOrEmpty(downloadDirectory))
            {
                Trace.WriteLine("Missing the first command line argument for pdf download path.");
                return;
            }

            // Set up log file
            string logsPath = Path.Combine(downloadDirectory, "log.txt");
            string logsDirectory = Path.GetDirectoryName(logsPath);
            if (!Directory.Exists(logsDirectory))
            {
                Directory.CreateDirectory(logsDirectory);
            }

            Trace.Listeners.Add(new TextWriterTraceListener(File.AppendText(logsPath), "traceListener"));

            try
            {
                UserCredential credential = CreateCredentials();
                IMailService mailService = MailService.CreateConnection(credential);
                IFileManager fileManager = new FileManager(downloadDirectory);
                BillsRunner runner = new BillsRunner(mailService, fileManager);

                bool processNewOnly = !args.Contains(ProcessAllFlag);
                bool clearAllLocalBills = args.Contains(ClearAllFlag);
                runner.Process(processNewOnly, clearAllLocalBills);
            }
            catch (Exception ex)
            {
                Trace.WriteLine(ex);
            }

            Trace.Flush();
        }

        private static UserCredential CreateCredentials()
        {
            string[] mailAccessScopes =
            {
                GmailService.Scope.GmailReadonly, GmailService.Scope.MailGoogleCom, GmailService.Scope.GmailModify,
                GmailService.Scope.GmailSettingsBasic
            };

            UserCredential credential;
            using (FileStream stream = new FileStream("credentials.json", FileMode.Open, FileAccess.Read))
            {
                // The file token.json stores the user's access and refresh tokens, and is created
                // automatically when the authorization flow completes for the first time.
                string credPath = "token.json";
                credential = GoogleWebAuthorizationBroker.AuthorizeAsync(
                    GoogleClientSecrets.Load(stream).Secrets,
                    mailAccessScopes,
                    "user",
                    CancellationToken.None,
                    new FileDataStore(credPath, true)).Result;
                Trace.WriteLine("Credential file saved to: " + credPath);
            }

            return credential;
        }
    }
}
