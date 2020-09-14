using System;
using System.IO;
using System.Net;
using Bills.BillsServerApi.Models;
using Bills.Properties;
using Newtonsoft.Json;

namespace Bills.BillsServerApi
{
    /// <inheritdoc />
    public class BillsServerApi : IBillsServerApi
    {
        private readonly JsonSerializer jsonSerializer;

        /// <summary>
        /// Default constructor
        /// </summary>
        public BillsServerApi()
        {
            this.jsonSerializer = JsonSerializer.Create();
        }

        /// <inheritdoc />
        public CreateBillResponse CreateBill(string date, string type, double totalAmount)
        {
            BillModel bill = null;
            string errorMessage = string.Empty;
            bool isSuccess = false;

            HttpWebRequest request = WebRequest.CreateHttp(Settings.Default.BillsAddApi);
            try
            {
                request.Method = "POST";
                request.ContentType = "application/json";
                BillModel billParams = new BillModel()
                {
                    date = date,
                    type = type,
                    total_amount = totalAmount
                };
                using (Stream reqStream = request.GetRequestStream())
                {
                    using (TextWriter textWriter = new StreamWriter(reqStream))
                    {
                        string billJson = JsonConvert.SerializeObject(billParams);
                        textWriter.Write(billJson);
                    }
                }

                HttpWebResponse webResponse = (HttpWebResponse) request.GetResponse();
                if (webResponse.StatusCode == HttpStatusCode.OK)
                {
                    using (JsonTextReader jsonReader = new JsonTextReader(new StreamReader(webResponse.GetResponseStream())))
                    {
                        bill = this.jsonSerializer.Deserialize<BillModel>(jsonReader);
                        isSuccess = true;
                    }
                }
            }
            catch (Exception ex)
            {
                isSuccess = false;
                errorMessage = ex.Message;
            }

            return new CreateBillResponse()
            {
                IsSuccess = isSuccess,
                ErrorMessage = errorMessage,
                Bill = bill
            };
        }
    }
}
