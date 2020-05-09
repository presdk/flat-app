using System;
using Xunit;

namespace DocumentParser.UnitTests
{
    public class Tests : IDisposable
    {
        private const string PowerBillText = @"Supplied to: 25 PALMERSTON ROAD, BIRKENHEAD, AUCKLAND
                                                ICP Number: 0001414732UN7FE
                                                Period from: 13/09/2019 to 14/10/2019 Next Read Date: 14/11/2019
                                                Description Meter Read Previous Current Mult Units Unit Total
                                                number type reading reading price
                                                24 Hour 210292576 Actual 056281 056550 1.00 .
                                                Unit Charges 269 kWh 19.71c $53.02
                                                Fixed Charge 32 Days 203.00c $64.96
                                                Sub total Electricity Charges $117.98
                                                GST $17.69
                                                Less 15.00% prompt payment discount (PPD) $20.35CR
                                                Total Electricity Charges $115.32
                                                Electricity:Your total usage for the last 32 days is 269 units (kWh).
                                                Gas charges - Actual
                                                Supplied to: 25 PALMERSTON ROAD, BIRKENHEAD, AUCKLAND
                                                ICP Number: 0001422032QTCE5
                                                Period from: 13/09/2019 to 10/10/2019 Next Read Date: 11/11/2019
                                                Description Meter Read Previous Current Mult Units Unit Total
                                                number type reading reading price
                                                Gas 236184 Actual 3046 3108 11.43 .
                                                Unit Charges 709 kWh 7.48c $53.03
                                                Fixed Charge 28 Days 111.00c $31.08
                                                Dual Fuel Discount $7.00CR
                                                Sub total gas charges $77.11
                                                GST $11.56
                                                Less 15.00% prompt payment discount (PPD) $14.51CR
                                                Total gas charges $74.16
                                                Gas:Your total usage for the last 28 days is 709 units (kWh).Total due $174.48
                                                Total GST for this invoice $24.71";
        public void Dispose()
        {

        }

        [Fact]
        public void Fact()
        {
            Assert.True(1 == 1);
        }
    }
}
