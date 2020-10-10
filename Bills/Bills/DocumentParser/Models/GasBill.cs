using System.Text.RegularExpressions;

namespace Bills.DocumentParser.Models
{
    public sealed class GasBill : BillBase
    {
        public override BillType BillType => BillType.Gas;

        protected override Regex AmountMatcher => new Regex(@"(?:Total gas charges.*)(?:\$)(\d+.\d+)");

        protected override Regex DateMatcher => new Regex(@"(?:Tax.*)(\d{2})\/(\d{2})\/(\d{2,})");

        public static string FolderPath => "gas";
    }
}
