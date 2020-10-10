using System.Text.RegularExpressions;

namespace Bills.DocumentParser.Models
{
    public sealed class WaterBill : BillBase
    {
        public static string FolderPath => "water";

        public override BillType BillType => BillType.Water;

        protected override Regex AmountMatcher => new Regex(@"(?:Total Amount Due.*)(?:\$)(\d+.\d+)");

        protected override Regex DateMatcher => new Regex(@"(?:Invoice Date.*)(\d{2})\/(\d{2})\/(\d{2,})");
    }
}
