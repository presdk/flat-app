const assert = require("assert");
const { Bill, BillType } = require("../../models/Bill");

describe("Bill model", () => {
  it("create bill has errors without req fields", () => {
    const bill = Bill();

    bill.validate((err) => {
      assert(err.errors.date);
      assert(err.errors.type);
      assert(err.errors.total_amount);
      assert(err.errors.reference_name);
    });
  });

  it("create bill sets default deleted flag", () => {
      const bill = Bill();

      assert(bill.is_deleted);
  });

  it("create bill has default files and payments", () => {
    const bill = Bill();

    assert(bill.files != null);
    assert(bill.files.length == 0);

    assert(bill.payments != null);
    assert(bill.payments.length == 0);
  });

  it("create bill has errors with negative total amount", () => {
    const bill = Bill({ total_amount: -1 });

    bill.validate((err) => {
      assert(err.errors.total_amount);
      assert.equal("Amount must be a positive number", err.errors.total_amount.message);
    });
  });
});
