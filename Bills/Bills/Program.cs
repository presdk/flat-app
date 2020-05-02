using System;
using System.Diagnostics;
using System.IO;
using System.Threading;
using Bills.Files;
using Bills.Mail;
using Bills.Runner;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Gmail.v1;
using Google.Apis.Util.Store;

namespace Bills
{
    public class Program
    {
        private static readonly string[] MailAccessScopes =
        {
            GmailService.Scope.GmailReadonly, GmailService.Scope.MailGoogleCom, GmailService.Scope.GmailModify,
            GmailService.Scope.GmailSettingsBasic
        };

        private static readonly string LogFileName = "log.txt";

        public static void Main(string[] args)
        {
            string currentDirectory = Directory.GetCurrentDirectory();
            IFileStore fileStore = new FileStore(currentDirectory);

            fileStore.CreateFile(LogFileName);
            string logFilePath = Path.Join(currentDirectory, LogFileName);
            Trace.Listeners.Add(new TextWriterTraceListener(File.AppendText(logFilePath), "traceListener"));

            UserCredential credential = CreateCredentials(); 

            try
            {
                IMailService mailService = MailService.CreateConnection(credential);
                IMailHelper mailHelper = new MailHelper(mailService, fileStore);

                IBillsRunner runner = new BillsRunner(mailHelper);
                runner.Start();
            }
            catch (Exception ex)
            {
                Trace.WriteLine(ex.Message);
            }

            Trace.Flush();
        }

        private static UserCredential CreateCredentials()
        {
            UserCredential credential = null;

            using (FileStream stream = new FileStream("credentials.json", FileMode.Open, FileAccess.Read))
            {
                // The file token.json stores the user's access and refresh tokens, and is created
                // automatically when the authorization flow completes for the first time.
                string credPath = "token.json";
                credential = GoogleWebAuthorizationBroker.AuthorizeAsync(
                    GoogleClientSecrets.Load(stream).Secrets,
                    MailAccessScopes,
                    "user",
                    CancellationToken.None,
                    new FileDataStore(credPath, true)).Result;
                Trace.WriteLine("Credential file saved to: " + credPath);
            }

            return credential;
        }
    }
}
