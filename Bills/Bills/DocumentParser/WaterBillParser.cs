using System;
using System.Text.RegularExpressions;
using Bills.DocumentParser.Models;

namespace Bills.DocumentParser
{
    public sealed class WaterBillParser : BillParserBase
    {
        protected override BillType BillType => BillType.Water;

        protected override Regex AmountMatcher => new Regex(@"(?:Total Amount Due.*)(?:\$)(\d+.\d+)");

        protected override Regex DateMatcher => new Regex(@"(?:Invoice Date.*)(\d{2})\/(\d{2})\/(\d{2,})");
    }
}
