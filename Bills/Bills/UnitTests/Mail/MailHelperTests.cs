using System;
using System.Collections.Generic;
using Bills.Files;
using Bills.Mail;
using Bills.Mail.Models;
using Moq;
using Xunit;

namespace Bills.UnitTests.Mail
{
    public class MailHelperTests : IDisposable
    {
        private readonly Mock<IMailService> mailService;
        private readonly Mock<IFileStore> fileStore;

        public MailHelperTests()
        {
            this.mailService = new Mock<IMailService>();
            this.fileStore = new Mock<IFileStore>();

            this.mailService.Setup(ms => ms.GetMessages(It.IsAny<string>(),
                It.IsAny<IList<AttachmentTypes>>())).Returns(new List<MessageModel>());
        }

        private MailHelper CreateHelper()
        {
            return new MailHelper(this.mailService.Object, this.fileStore.Object);
        }

        public void Dispose()
        {
        }

        [Fact]
        public void DownloadMessagesCreatesOutputDirectory()
        {
            MailHelper helper = CreateHelper();

            helper.DownloadMessages(null, null, "outputFolder");

            this.fileStore.Verify(fs => fs.CreateDirectory("outputFolder"), Times.Once);
        }

        [Fact]
        public void DownloadMessagesStoppedWhenCreateDirectoryThrowsError()
        {
            this.fileStore.Setup(fs => fs.CreateDirectory(It.IsAny<string>())).Throws<Exception>();

            MailHelper helper = CreateHelper();

            bool isDlSuccess = helper.DownloadMessages(null, null, "invalid folder");

            this.mailService.Verify(ms => ms.GetMessages(It.IsAny<string>(),
                It.IsAny<IList<AttachmentTypes>>()), Times.Never);
            Assert.False(isDlSuccess);
        }

        [Fact]
        public void DownloadMessages()
        {
            string actualSavePath = null;

            MessageModel message = new MessageModel();
            AddPdfFile(message);
            IList<MessageModel> messages = new List<MessageModel>() {message};
            this.mailService.Setup(ms => ms.GetMessages("filter", new List<AttachmentTypes>() { AttachmentTypes.Pdf })).Returns(messages);

            this.fileStore.Setup(fs => fs.SaveFile(It.IsAny<byte[]>(), It.IsAny<string>()))
                .Callback<byte[], string>((data, savePath) =>
                {
                    actualSavePath = savePath;
                });

            MailHelper helper = CreateHelper();

            helper.DownloadMessages("filter", new List<AttachmentTypes>(){AttachmentTypes.Pdf}, "outputFolder");

            Assert.EndsWith(".pdf", actualSavePath);
            Assert.StartsWith("outputFolder", actualSavePath);
            this.fileStore.Verify(fs => fs.SaveFile(It.IsAny<byte[]>(), It.IsAny<string>()), Times.Once);
        }

        private static void AddPdfFile(MessageModel message)
        {
            message.Files.Add(new FileModel(AttachmentTypes.Pdf, new byte[]{1}));
        }
    }
}
