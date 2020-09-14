namespace Bills.BillsServerApi
{
    /// <summary>
    /// The bills server api
    /// </summary>
    public interface IBillsServerApi
    {
        /// <summary>
        /// Creates a bill and returns the response
        /// </summary>
        /// <param name="date">the date of the bill in the format dd-mm-yyyy</param>
        /// <param name="type">the bill type, either water, power, internet</param>
        /// <param name="totalAmount">the total amount of the bill</param>
        CreateBillResponse CreateBill(string date, string type, double totalAmount);
    }
}
