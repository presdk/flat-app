using Bills.DocumentParser;
using Bills.DocumentParser.Models;
using System;
using Xunit;

namespace Bills.UnitTests.DocumentParser
{
    public class PowerBillParserTests : IDisposable
    {
        private readonly PowerBillParser powerBillParser;

        public void Dispose()
        {
        }

        public PowerBillParserTests()
        {
            this.powerBillParser = new PowerBillParser();
        }

        [Theory]
        [InlineData(PowerBillText, 22, 12, 2019, BillType.Power, 153.25)]
        [InlineData(PowerBillText2, 22, 3, 2020, BillType.Power, 105.93)]
        [InlineData(PowerBillText3, 22, 11, 2019, BillType.Power, 182.65)]
        public void FromTextHasCorrectBillFieldsForPowerBill(string billText, 
            int day, int month, int year, BillType billType, double amount)
        {
            Bill powerBill = this.powerBillParser.ParseBill(billText);

            Assert.Equal(day, powerBill.Day);
            Assert.Equal(month, powerBill.Month);
            Assert.Equal(year, powerBill.Year);
            Assert.Equal(billType, powerBill.BillType);
            Assert.Equal(amount, powerBill.Amount);
        }

        #region Test Data

        private const string PowerBillText = @"Freephone enquiries: 0800 87 87 87
                                                Webchat: ask.trustpower.co.nz
                                                8.00am - 7.00pm Mon to Fri
                                                Account balance: 0800 720 022
                                                MR C T S UNI
                                                25 CONTOSO ROAD
                                                Your Account no:
                                                CONTOSO 314159942
                                                CONTOSO CITY
                                                Tax Invoice Date: 22/12/2019
                                                Tax Invoice No: 5035849717
                                                GST No: 31-141-593
                                                Hi, here's your bill, it's due on 09/01/2020 thank you
                                                Total Due
                                                Payment is due on 09/01/2020 $153.25
                                                Total amount due if paid after 09/01/2020... $181.76
                                                Previous Account
                                                Previous balance $182.65
                                                Payments and credits
                                                $182.65CR
                                                received
                                                Balance brought forward $0.00
                                                This Account
                                                Electricity $108.95
                                                Gas $72.81
                                                Prompt payment discount
                                                $28.51CR
                                                If paid before 09/01/2020
                                                WAYS TO PAY
                                                Ways to pay your bill.
                                                Direct Debit: arrange to pay your bill automatically each month.
                                                Automatic Payment, Telebanking or Internet Banking: please select TRUSTPOWER from the pre-loaded payees on
                                                your bank's bill payment internet site and complete the fields as prompted.
                                                Trustpower Bank Account Details, for Automatic Payments, Telebanking or Internet Banking:
                                                Bank Account number: 01-1839-0329105-01
                                                We are proud of our service and strive to get it right. If you have any concerns please call us on 0800 87 87 87 or contact us at
                                                www.trustpower.co.nz/contact and let us work with you, to put it right, at no cost. In the unlikely event we can't resolve your complaint,
                                                for free and independent advice, please contact: 
                                                Utilities Disputes Ltd regarding your electricity or gas on 0800 22 33 40 or www.utilitiesdisputes.co.nz 
                                                Telecommunication Dispute Resolution regarding your phone or broadband on 0508 98 98 98 or www.tdr.org.nzYour bill details
                                                Previous Account
                                                Payments and credits
                                                Date Description Amount
                                                . Amount from previous account $182.65
                                                10/12/2019 Payment Received - Thank You $182.65CR
                                                Balance brought forward $0.00
                                                Electricity charges - Actual
                                                Supplied to: 25 CONTOSO ROAD, CONTOSO, CONTOSO CITY
                                                ICP Number: 0001414732UN7FE
                                                Period from: 15/11/2019 to 13/12/2019 Next Approximate Read Date: 16/01/2020
                                                Description Meter Read Previous Current Mult Units Unit Total
                                                number type reading reading price
                                                210292576 Actual 056756 056938 1.00 .
                                                24 Hour 182 kWh 19.71c $35.87
                                                Fixed Charge 29 Days 203.00c $58.87
                                                Sub total Electricity Charges $94.74
                                                GST $14.21
                                                Less 15.00% prompt payment discount (PPD) $16.34CR
                                                Total Electricity Charges $92.61
                                                Electricity:Your total usage for the last 92 days is 657 units (kWh).
                                                Gas charges - Actual
                                                Supplied to: 25 CONTOSO ROAD, CONTOSO, CONTOSO CITY
                                                ICP Number: 0001422032QTCE5
                                                Period from: 12/11/2019 to 10/12/2019 Next Approximate Read Date: 13/01/2020
                                                Description Meter Read Previous Current Mult Units Unit Total
                                                number type reading reading price
                                                236184 Actual 3176 3222 11.15 .
                                                Gas 513 kWh 7.48c $38.37
                                                Fixed Charge 29 Days 111.00c $32.19
                                                Dual Fuel Discount $7.25CR
                                                Sub total gas charges $63.31
                                                GST $9.50
                                                Less 15.00% prompt payment discount (PPD) $12.17CR
                                                Total gas charges $60.64
                                                Gas:Your total usage for the last 89 days is 1987 units (kWh).
                                                Total due $153.25
                                                Total GST for this invoice $19.99";

        const string PowerBillText2 = @"Freephone enquiries: 0800 87 87 87
                                        Webchat: ask.trustpower.co.nz
                                        8.00am - 7.00pm Mon to Fri
                                        Account balance: 0800 720 022
                                        MR C T S UNI
                                        25 CONTOSO ROAD
                                        Your Account no:
                                        CONTOSO 314159942
                                        CONTOSO CITY
                                        Tax Invoice Date: 22/03/2020
                                        Tax Invoice No: 5036991756
                                        GST No: 31-141-593
                                        Hi, here's your bill, it's due on 09/04/2020 thank you
                                        Total Due
                                        Payment is due on 09/04/2020 $105.93
                                        Total amount due if paid after 09/04/2020... $126.05
                                        Previous Account
                                        Previous balance $127.01
                                        Payments and credits
                                        $127.01CR
                                        received
                                        Balance brought forward $0.00
                                        This Account
                                        Electricity $85.11
                                        Gas $40.94
                                        Prompt payment discount
                                        $20.12CR
                                        If paid before 09/04/2020
                                        WAYS TO PAY
                                        Ways to pay your bill.
                                        Direct Debit: arrange to pay your bill automatically each month.
                                        Automatic Payment, Telebanking or Internet Banking: please select TRUSTPOWER from the pre-loaded payees on
                                        your bank's bill payment internet site and complete the fields as prompted.
                                        Trustpower Bank Account Details, for Automatic Payments, Telebanking or Internet Banking:
                                        Bank Account number: 01-1839-0329105-01
                                        We are proud of our service and strive to get it right. If you have any concerns please call us on 0800 87 87 87 or contact us at
                                        www.trustpower.co.nz/contact and let us work with you, to put it right, at no cost. In the unlikely event we can't resolve your complaint,
                                        for free and independent advice, please contact: 
                                        Utilities Disputes Ltd regarding your electricity or gas on 0800 22 33 40 or www.utilitiesdisputes.co.nz 
                                        Telecommunication Dispute Resolution regarding your phone or broadband on 0508 98 98 98 or www.tdr.org.nzYour bill details
                                        Previous Account
                                        Payments and credits
                                        Date Description Amount
                                        . Amount from previous account $127.01
                                        24/02/2020 Payment Received - Thank You $127.01CR
                                        Balance brought forward $0.00
                                        Electricity charges - Actual
                                        Supplied to: 25 CONTOSO ROAD, CONTOSO, CONTOSO CITY
                                        ICP Number: 0001414732UN7FE
                                        Period from: 18/02/2020 to 13/03/2020 Next Approximate Read Date: 16/04/2020
                                        Description Meter Read Previous Current Mult Units Unit Total
                                        number type reading reading price
                                        210292576 Actual 057219 057337 1.00 .
                                        24 Hour 118 kWh 19.71c $23.26
                                        Fixed Charge 25 Days 203.00c $50.75
                                        Sub total Electricity Charges $74.01
                                        GST $11.10
                                        Less 15.00% prompt payment discount (PPD) $12.77CR
                                        Total Electricity Charges $72.34
                                        Electricity:Your total usage for the last 183 days is 1056 units (kWh).
                                        Gas charges - Actual
                                        Supplied to: 25 CONTOSO ROAD, CONTOSO, CONTOSO CITY
                                        ICP Number: 0001422032QTCE5
                                        Period from: 12/02/2020 to 10/03/2020 Next Approximate Read Date: 09/04/2020
                                        Description Meter Read Previous Current Mult Units Unit Total
                                        number type reading reading price
                                        236184 Actual 3271 3285 11.03 .
                                        Gas 154 kWh 7.48c $11.52
                                        Fixed Charge 28 Days 111.00c $31.08
                                        Dual Fuel Discount $7.00CR
                                        Sub total gas charges $35.60
                                        GST $5.34
                                        Less 15.00% prompt payment discount (PPD) $7.35CR
                                        Total gas charges $33.59
                                        Gas:Your total usage for the last 180 days is 2681 units (kWh).
                                        Total due $105.93
                                        Total GST for this invoice $13.81";

        const string PowerBillText3 = @"Freephone enquiries: 0800 87 87 87
                                        Webchat: ask.trustpower.co.nz
                                        8.00am - 7.00pm Mon to Fri
                                        Account balance: 0800 720 022
                                        MR C T S UNI
                                        25 CONTOSO ROAD
                                        Your Account no:
                                        CONTOSO 314159942
                                        CONTOSO CITY
                                        Tax Invoice Date: 22/11/2019
                                        Tax Invoice No: 5035465663
                                        GST No: 31-141-593
                                        Hi, here's your bill, it's due on 10/12/2019 thank you
                                        Total Due
                                        Payment is due on 10/12/2019 $182.65
                                        Total amount due if paid after 10/12/2019... $216.51
                                        Previous Account
                                        Previous balance $174.48
                                        Payments and credits
                                        $174.48CR
                                        received
                                        Balance brought forward $0.00
                                        This Account
                                        Electricity $119.06
                                        Gas $97.45
                                        Prompt payment discount
                                        $33.86CR
                                        If paid before 10/12/2019
                                        WAYS TO PAY
                                        Ways to pay your bill.
                                        Direct Debit: arrange to pay your bill automatically each month.
                                        Automatic Payment, Telebanking or Internet Banking: please select TRUSTPOWER from the pre-loaded payees on
                                        your bank's bill payment internet site and complete the fields as prompted.
                                        Trustpower Bank Account Details, for Automatic Payments, Telebanking or Internet Banking:
                                        Bank Account number: 01-1839-0329105-01
                                        We are proud of our service and strive to get it right. If you have any concerns please call us on 0800 87 87 87 or contact us at
                                        www.trustpower.co.nz/contact and let us work with you, to put it right, at no cost. In the unlikely event we can't resolve your complaint,
                                        for free and independent advice, please contact: 
                                        Utilities Disputes Ltd regarding your electricity or gas on 0800 22 33 40 or www.utilitiesdisputes.co.nz 
                                        Telecommunication Dispute Resolution regarding your phone or broadband on 0508 98 98 98 or www.tdr.org.nzYour bill details
                                        Previous Account
                                        Payments and credits
                                        Date Description Amount
                                        . Amount from previous account $174.48
                                        29/10/2019 Payment Received - Thank You $174.48CR
                                        Balance brought forward $0.00
                                        Electricity charges - Actual
                                        Supplied to: 25 CONTOSO ROAD, CONTOSO, CONTOSO CITY
                                        ICP Number: 0001414732UN7FE
                                        Period from: 15/10/2019 to 14/11/2019 Next Approximate Read Date: 13/12/2019
                                        Description Meter Read Previous Current Mult Units Unit Total
                                        number type reading reading price
                                        210292576 Actual 056550 056756 1.00 .
                                        24 Hour 206 kWh 19.71c $40.60
                                        Fixed Charge 31 Days 203.00c $62.93
                                        Sub total Electricity Charges $103.53
                                        GST $15.53
                                        Less 15.00% prompt payment discount (PPD) $17.86CR
                                        Total Electricity Charges $101.20
                                        Electricity:Your total usage for the last 63 days is 475 units (kWh).
                                        Gas charges - Actual
                                        Supplied to: 25 CONTOSO ROAD, CONTOSO, CONTOSO CITY
                                        ICP Number: 0001422032QTCE5
                                        Period from: 11/10/2019 to 11/11/2019 Next Approximate Read Date: 10/12/2019
                                        Description Meter Read Previous Current Mult Units Unit Total
                                        number type reading reading price
                                        236184 Actual 3108 3176 11.26 .
                                        Gas 765 kWh 7.48c $57.22
                                        Fixed Charge 32 Days 111.00c $35.52
                                        Dual Fuel Discount $8.00CR
                                        Sub total gas charges $84.74
                                        GST $12.71
                                        Less 15.00% prompt payment discount (PPD) $16.00CR
                                        Total gas charges $81.45
                                        Gas:Your total usage for the last 60 days is 1474 units (kWh).
                                        Total due $182.65
                                        Total GST for this invoice $23.82";
        #endregion
    }
}
