using System.Collections.Generic;

namespace Bills.BillsServerApi.Models
{
    public class BillModel
    {
        public string date { get; set; } = string.Empty;

        public string type { get; set; } = string.Empty;

        public double total_amount { get; set; } = 0;

        public string reference_name { get; set; } = string.Empty;

        public bool is_admin_confirmed { get; set; } = false;

        public bool is_deleted { get; set; } = false;
        
        public IList<FileModel> files { get; set; } = new List<FileModel>();

        public IList<BillPaymentModel> payments { get; set; } = new List<BillPaymentModel>();
    }
}
