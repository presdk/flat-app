using System;
using System.Collections.Generic;
using System.Text;

namespace Bills.BillsServerApi.Models
{
    public class BillPaymentModel
    {
        public string userId { get; set; }

        public string status { get; set; }

        public int usage_in_days { get; set; }

        public double payable_amount { get; set; }
    }
}
