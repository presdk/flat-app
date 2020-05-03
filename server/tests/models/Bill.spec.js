const assert = require("assert");
const { Bill, BillType } = require("../../models/Bill");

describe("Bill model", () => {
  it("create bill has errors without req fields", () => {
    const bill = Bill();

    bill.validate((err) => {
      assert(err.errors.date);
      assert(err.errors.type);
      assert(err.errors.total_amount);
    });
  });

  it("create bill sets default flags", () => {
    const bill = Bill();

    assert.equal(false, bill.is_admin_confirmed);
    assert.equal(false, bill.is_deleted);
  });

  it("create bill has default empty files and payments", () => {
    const bill = Bill();

    assert(bill.files != null);
    assert(bill.files.length == 0);

    assert(bill.payments != null);
    assert(bill.payments.length == 0);
  });

  it("create bill has errors when negative total amount", () => {
    const bill = Bill({ total_amount: -1 });

    bill.validate((err) => {
      assert(err.errors.total_amount);
      assert.equal(
        "Amount must be a positive number",
        err.errors.total_amount.message
      );
    });
  });

  it("create bill validates date format", () => {
    const testCases = [
      { date: "01/01/20", isValid: false },
      { date: "1 January 2020", isValid: false },
      { date: "1-1-20", isValid: false },
      { date: "--------", isValid: false },
      { date: "01-01-20", isValid: true },
    ];

    testCases.forEach((tc) => {
      const { date, isValid } = tc;
      const bill = Bill({ date: date });
      bill.validate((err) => {
        assert.equal(isValid, err.errors.date == null);
      });
    });
  });

  it("bill create payments creates correct payments", () => {
    const bill = Bill({ total_amount: 100 });
    const paymentInfo1 = { userId: 1, usage_in_days: 1, payable_amount: 0 };
    const paymentInfo2 = { userId: 2, usage_in_days: 1, payable_amount: 0 };
    bill.payments.push(paymentInfo1);
    bill.payments.push(paymentInfo2);

    bill.calculatePayments([paymentInfo1, paymentInfo2]);

    assert(2, bill.payments.length);

    assert(50, bill.payments[0].payable_amount);
    assert(1, bill.payments[0].userId);
    assert(1, bill.payments[0].usage_in_days);

    assert(50, bill.payments[1].payable_amount);
    assert(1, bill.payments[1].userId);
    assert(1, bill.payments[1].usage_in_days);
  });

  it("create bill generates reference", () => {
    const billPayment = Bill({ type: BillType.Water, date: "01-01-20" });

    billPayment.generateReference();

    assert.equal("water-01-01-20", billPayment.reference_name);
  });
});
