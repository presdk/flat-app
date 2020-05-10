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

  it("update bill only updates modifiable fields", () => {
    const billPayment = BillPayment();
    billPayment.userId = "user1";
    billPayment.status = "paid";
    billPayment.usage_in_days = 1;
    billPayment.payable_amount = 1;

    const updatedPayment = {
      userId: "user2",
      status: "unpaid",
      usage_in_days: 2,
      payable_amount: 2
    };

    billPayment.update(updatedPayment);

    // Modifiable fields
    assert.equal("unpaid", billPayment.status);
    assert.equal(2, billPayment.usage_in_days);

    assert.equal("user1", billPayment.userId);
    assert.equal(1, billPayment.payable_amount);
  })

  it("update bill persists all fields when no changes provided", () => {
    const billPayment = BillPayment();
    billPayment.userId = "user1";
    billPayment.status = "paid";
    billPayment.usage_in_days = 1;
    billPayment.payable_amount = 1;

    const updatedPayment = {};

    billPayment.update(updatedPayment);

    assert.equal("user1", billPayment.userId);
    assert.equal("paid", billPayment.status);
    assert.equal(1, billPayment.usage_in_days);
    assert.equal(1, billPayment.payable_amount);
  })
});