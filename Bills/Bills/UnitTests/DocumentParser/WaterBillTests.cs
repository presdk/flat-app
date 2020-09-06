using Bills.DocumentParser.Models;
using Xunit;

namespace Bills.UnitTests.DocumentParser
{
    public class WaterBillTests
    {
        public void Dispose()
        {
        }

        public WaterBillTests()
        {
        }

        [Theory]
        [InlineData(WaterBillText, 17, 4, 2020, BillType.Water, 136.1)]
        [InlineData(WaterBillText2, 17, 12, 2019, BillType.Water, 55.2)]
        [InlineData(WaterBillText3, 17, 2, 2020, BillType.Water, 88.3)]
        public void FromTextHasCorrectBillFieldsForPowerBill(string billText,
            int day, int month, int year, BillType billType, double amount)
        {
            BillBase waterBill = BillBase.CreateBill(BillType.Water, billText);

            Assert.Equal(day, waterBill.Day);
            Assert.Equal(month, waterBill.Month);
            Assert.Equal(year, waterBill.Year);
            Assert.Equal(billType, waterBill.BillType);
            Assert.Equal(amount, waterBill.Amount);
        }

        #region Test Data

        private const string WaterBillText = @" Tenant A & Tenant B Print Date: 17/04/2020
                                                25 Contoso Rd,  Contoso City,  Contoso Due Date: 01/05/2020
                                                Reference No. 507693201
                                                Statement / Invoice
                                                Property Address: 25 Contoso Rd,  Contoso City, Contoso (Invoice Date: 17/04/2020)
                                                Water rates 13u 2423-2436e 10/3-9/4 $47.80
                                                Other Amounts Still Owing $88.30
                                                Total Amount Due: $136.10
                                                Payment due within 7 days please.
                                                Ledger Balances
                                                Please make direct payment to account: Contoso Real Estate Limited
                                                Bank ANZ
                                                Branch Albany
                                                Account No. 01-1415-9265358979-02
                                                Ref (Tenant Code) 25CONTOSO
                                                Agent Name: Agent Contoso
                                                Agent Position:
                                                Agent Office:
                                                09 481 0642
                                                Agent Email: agent@contoso.com";

        private const string WaterBillText2 = @" Tenant A & Tenant B Print Date: 17/12/2019
                                                25 Contoso Rd,  Contoso City,  Contoso Due Date: 31/12/2019
                                                Reference No. 507693201
                                                Statement / Invoice
                                                Property Address: 25 Contoso Rd,  Contoso City, Contoso (Invoice Date: 17/12/2019)
                                                Water rates 15u 2354-2369e 11/11-9/12 $55.20
                                                Total Amount Due: $55.20
                                                Payment due within 7 days please.
                                                Ledger Balances
                                                Please make direct payment to account: Contoso Real Estate Limited
                                                Bank ANZ
                                                Branch Albany
                                                Account No. 01-1415-9265358979-02
                                                Ref (Tenant Code) 25CONTOSO
                                                Agent Name: Agent Contoso
                                                Agent Position:
                                                Agent Office:
                                                09 481 0642
                                                Agent Email: agent@contoso.com";

        private const string WaterBillText3 = @" Tenant A & Tenant B Print Date: 17/02/2020
                                                25 Contoso Rd,  Contoso City,  Contoso Due Date: 02/03/2020
                                                Reference No. 507693201
                                                Statement / Invoice
                                                Property Address: 25 Contoso Rd,  Contoso City, Contoso (Invoice Date: 17/02/2020)
                                                 Water rates 24u 2399-2423e 13/1-12/2 $88.30
                                                Total Amount Due: $88.30
                                                Payment due within 7 days please.
                                                Ledger Balances
                                                Please make direct payment to account: Contoso Real Estate Limited
                                                Bank ANZ
                                                Branch Albany
                                                Account No. 01-1415-9265358979-02
                                                Ref (Tenant Code) 25CONTOSO
                                                Agent Name: Agent Contoso
                                                Agent Position:
                                                Agent Office:
                                                09 481 0642
                                                Agent Email: agent@contoso.com";

        #endregion
    }
}
