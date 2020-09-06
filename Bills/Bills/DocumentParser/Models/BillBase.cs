using System;
using System.Diagnostics;
using System.IO;
using System.Text.RegularExpressions;
using Xunit;

namespace Bills.DocumentParser.Models
{
    /// <summary>
    /// The bill model
    /// </summary>
    public abstract class BillBase
    {
        /// <summary>
        /// The day of the bill
        /// </summary>
        public int Day { get; set; }

        /// <summary>
        /// The month of the bill
        /// </summary>
        public int Month { get; set; }

        /// <summary>
        /// The year of the bill
        /// </summary>
        public int Year { get; set; }

        /// <summary>
        /// The dollar amount of the bill
        /// </summary>
        public double Amount { get; set; }

        /// <summary>
        /// The bill type
        /// </summary>
        public abstract BillType BillType { get; }

        /// <summary>
        /// A matcher to retrieve the amount without the dollar sign
        /// </summary>
        protected abstract Regex AmountMatcher { get; }

        /// <summary>
        /// A matcher to retrieve the date in the format: dd/mm/yyyy
        /// </summary>
        protected abstract Regex DateMatcher { get; }

        /// <summary>
        /// Creates a bill of the given type
        /// </summary>
        /// <param name="billType">the bill type</param>
        /// <param name="text">the text to load from</param>
        /// <returns></returns>
        public static BillBase CreateBill(BillType billType, string text)
        {
            BillBase bill = null;
            switch (billType)
            {
                case BillType.Water:
                    bill = new WaterBill();
                    break;
                case BillType.Power:
                    bill = new PowerBill();
                    break;
                case BillType.Internet:
                    Debug.Assert(false, "Not implemented");
                    throw new NotImplementedException();
                    break;
            }

            bill.FromText(text);
            return bill;
        }

        public override string ToString()
        {
            return $"Date: {this.Day}-{this.Month}-{this.Year}, Type: {this.BillType}, Amount: ${this.Amount}";
        }

        /// <summary>
        /// Parses the bill from text
        /// </summary>
        /// <param name="text">the bill in text</param>
        protected void FromText(string text)
        {
            StringReader reader = new StringReader(text);

            string line;
            while ((line = reader.ReadLine()) != null)
            {
                Tuple<int, int, int> date = TryGetDate(line);
                if (date != null)
                {
                    (this.Day, this.Month, this.Year) = date;
                    continue;
                }

                double amount = TryGetAmount(line);
                if (!double.IsNaN(amount))
                {
                    this.Amount = amount;
                    continue;
                }
            }
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
