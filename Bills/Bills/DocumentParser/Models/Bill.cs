namespace Bills.DocumentParser.Models
{
    /// <summary>
    /// The bill model
    /// </summary>
    public class Bill
    {
        public int Day { get; set; }

        public int Month { get; set; }

        public int Year { get; set; }

        public BillType BillType { get; set; }

        public double Amount { get; set; }
    }
}
