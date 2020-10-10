using System.Text.RegularExpressions;

namespace Bills.DocumentParser.Models
{
    public sealed class PowerBill : BillBase
    {
        public static string FolderPath => "power";

        public override BillType BillType => BillType.Power;

        protected override Regex AmountMatcher => new Regex(@"(?:Total Electricity Charges.*)(?:\$)(\d+.\d+)");

        protected override Regex DateMatcher => new Regex(@"(?:Tax.*)(\d{2})\/(\d{2})\/(\d{2,})");
    }
}
