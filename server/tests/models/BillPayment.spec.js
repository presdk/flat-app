const assert = require("assert");
const { BillPayment, PaymentStatus } = require("../../models/BillPayment");

describe("Bill payment model", () => {
  it("create bill payment has errors without req fields", () => {
    const billPayment = BillPayment();

    billPayment.validate((err) => {
      assert(err.errors.userId);
      assert(err.errors.usage_in_days);
      assert(err.errors.payable_amount);
    });
  });

  it("create bill payment sets default status", () => {
    const billPayment = BillPayment();
    
    assert(PaymentStatus.Unpaid, billPayment.status);
  });
});