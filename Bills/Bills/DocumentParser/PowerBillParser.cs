using System.Text.RegularExpressions;
using Bills.DocumentParser.Models;

namespace Bills.DocumentParser
{
    public sealed class PowerBillParser : BillParserBase
    {
        protected override BillType BillType => BillType.Power;

        protected override Regex AmountMatcher => new Regex(@"(?:Total due.*)(?:\$)(\d+.\d+)");

        protected override Regex DateMatcher => new Regex(@"(?:Tax.*)(\d{2})\/(\d{2})\/(\d{2,})");
    }
}
