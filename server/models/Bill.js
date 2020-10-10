const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const { FileSchema } = require("./File");
const { BillPaymentSchema, BillPayment } = require("./BillPayment");

const BillType = Object.freeze({
  Water: "water",
  Power: "power",
  Internet: "internet",
  Gas: "gas",
  Misc: "misc",
});

/**
 * @typedef Bill
 * @property {string} date.required - The date of the issued bill in the format `dd-mm-yy`
 * @property {string} type.required - The type of the bill: `water` or `power` or `gas` or `internet` or `misc`
 * @property {Number} total_amount.required - The total dollar amount of the bill
 * @property {Number} fixed_amount - The fixed dollar amount of the bill that is always split between each member regardless of stay duration.
 * @property {string} reference_name - The  reference name to use for the payment of this bill in the format `'<first letter of type><month><year>'`
 * @property {Boolean} is_admin_confirmed - True if the correctness of the bill has been confirmed by the admin
 * @property {Boolean} is_deleted - True if the bill has been deleted
 * @property {Array.<File>} files - Files attached to the bill
 * @property {Array.<BillPayment>} payments - The payment requests issued from this bill
 */
const BillSchema = new Schema({
  date: {
    type: String,
    required: true,
    validate: {
      validator: (date) => {
        return /\d\d-\d\d-\d\d\d\d/.test(date);
      },
    },
  },
  type: { type: String, required: true, enum: Object.values(BillType) },
  total_amount: {
    type: Number,
    required: true,
    min: [0, "Amount must be a positive number"],
  },
  fixed_amount: {
    type: Number,
    required: false,
    min: [0, "Amount must be a positive number"],
    default: 0
  },
  reference_name: String,
  is_admin_confirmed: { type: Boolean, default: false },
  is_deleted: { type: Boolean, default: false },
  files: [FileSchema],
  payments: [BillPaymentSchema],
});

// Calculate the amount to pay for each payment
BillSchema.methods.calculatePayments = function () {
  if (this.payments.length <= 0) {
    return;
  }

  const totalUsageInDays = this.payments
  .map((p) => p.usage_in_days)
  .reduce((a, b) => a + b);

  this.payments.forEach((p) => {
    const { usage_in_days } = p;

    const amountToPay = usage_in_days > 0 ? this.total_amount * (usage_in_days / totalUsageInDays) : 0;
    const fixedToPay = this.fixed_amount / this.payments.length;
    p.payable_amount = amountToPay + fixedToPay;
  });
};

// Update the existing payments with changes or add as new payments
BillSchema.methods.updatePayments = function (updatedPayments) {
  let paymentsToSave = [];

  updatedPayments.forEach((payment) => {
    const { userId } = payment;

    const existingPayment = this.payments.find(
      (payment) => payment.userId == userId
    );

    if (existingPayment) {
      // Update the existing payment
      existingPayment.update(payment);
      paymentsToSave.push(existingPayment);
    } else {
      paymentsToSave.push(payment);
    }
  });

  this.payments = paymentsToSave;
};

// Generates the reference using the date and type
BillSchema.methods.generateReference = function () {
  const typeCode = this.type.substring(0,1);

  const dateTokens = this.date.split('-');
  const month = dateTokens[1];
  const year = dateTokens[2];
  this.reference_name = `${typeCode}${month}${year.substring(2)}`;
};

BillSchema.post("validate", function () {
  this.calculatePayments();
  this.generateReference();
});

module.exports = {
  Bill: mongoose.model("Bill", BillSchema),
  BillSchema: BillSchema,
  BillType: BillType,
};
