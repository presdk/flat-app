using Bills.DocumentParser.Models;
using System;
using System.IO;
using System.Text.RegularExpressions;

namespace Bills.DocumentParser
{
    /// <summary>
    /// Parser for bills
    /// </summary>
    public abstract class BillParserBase
    {
        protected abstract BillType BillType { get; }

        /// <summary>
        /// A matcher to retrieve the amount without the dollar sign
        /// </summary>
        protected abstract Regex AmountMatcher { get; }

        /// <summary>
        /// A matcher to retrieve the date in the format: dd/mm/yyyy
        /// </summary>
        protected abstract Regex DateMatcher { get; }

        /// <summary>
        /// Parses the bill from text
        /// </summary>
        /// <param name="text">the bill in text</param>
        public Bill ParseFromText(string text)
        {
            Bill bill = new Bill()
            {
                BillType = this.BillType
            };

            StringReader reader = new StringReader(text);

            string line = null;
            while ((line = reader.ReadLine()) != null)
            {
                Tuple<int, int, int> date = TryGetDate(line);
                if (date != null)
                {
                    (bill.Day, bill.Month, bill.Year) = date;
                    continue;
                }

                double amount = TryGetAmount(line);
                if (!double.IsNaN(amount))
                {
                    bill.Amount = amount;
                    continue;
                }
            }

            return bill;
        }

        protected Tuple<int, int, int> TryGetDate(string line)
        {
            if (this.DateMatcher.IsMatch(line))
            {
                Match match = this.DateMatcher.Match(line);
                GroupCollection groups = match.Groups;

                if (groups.Count == 4)
                {
                    int day = int.Parse(groups[1].Value);
                    int month = int.Parse(groups[2].Value);
                    int year = int.Parse(groups[3].Value);

                    return Tuple.Create(day, month, year);
                }
            }

            return null;
        }

        protected double TryGetAmount(string line)
        {
            if (this.AmountMatcher.IsMatch(line))
            {
                Match match = this.AmountMatcher.Match(line);
                if (match.Groups.Count == 2)
                {
                    string amount = match.Groups[1].Value;

                    return double.Parse(amount);
                }
            }

            return double.NaN;
        }
    }
}
