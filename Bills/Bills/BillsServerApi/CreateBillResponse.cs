using System;
using System.Collections.Generic;
using System.Text;
using Bills.BillsServerApi.Models;

namespace Bills.BillsServerApi
{
    public class CreateBillResponse
    {
        public bool IsSuccess { get; set; }

        public string ErrorMessage { get; set; }

        public BillModel Bill { get; set; }
    }
}
