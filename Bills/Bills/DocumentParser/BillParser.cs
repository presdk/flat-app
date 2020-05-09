using Bills.DocumentParser.Models;
using System.IO;
using System.Text.RegularExpressions;

namespace Bills.DocumentParser
{
    public class PowerBillParser
    {
        private static readonly Regex DateMatcher = new Regex(@"(\d+)\/(\d+)\/(\d+)");
        private static readonly Regex AmountMatcher = new Regex(@"(\$)(\d+.\d+)");

        private Bill powerBill;

        /// <summary>
        /// Parses the bill from text
        /// </summary>
        /// <param name="text">the bill in text</param>
        public Bill ParseBill(string text)
        {
            StringReader reader = new StringReader(text);

            this.powerBill = new Bill()
            {
                BillType = BillType.Power
            };

            string line = null;
            while ((line = reader.ReadLine()) != null)
            {
                if (line.Contains("Tax Invoice Date"))
                {
                    SetDates(line);
                }
                else if (line.Contains("Total due"))
                {
                    SetAmount(line);
                }
            }

            return this.powerBill;
        }

        private void SetDates(string line)
        {
            if (DateMatcher.IsMatch(line))
            {
                Match match = DateMatcher.Match(line);
                GroupCollection groups = match.Groups;

                if (groups.Count == 4)
                {
                    this.powerBill.Day = int.Parse(groups[1].Value);
                    this.powerBill.Month = int.Parse(groups[2].Value);
                    this.powerBill.Year = int.Parse(groups[3].Value);
                }
            }
        }

        private void SetAmount(string line)
        {
            if (AmountMatcher.IsMatch(line))
            {
                Match match = AmountMatcher.Match(line);
                if (match.Groups.Count == 3)
                {
                    string dollarSign = match.Groups[1].Value;
                    string amount = match.Groups[2].Value;

                    this.powerBill.Amount = double.Parse(amount);
                }
            }
        }
    }
}
