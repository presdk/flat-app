const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const { FileSchema } = require("./File");
const { BillPaymentSchema, BillPayment } = require("./BillPayment");

const BillType = Object.freeze({
  Water: "water",
  Power: "power",
  Internet: "internet",
  Misc: "misc",
});

/**
 * @typedef Bill
 * @property {string} date.required - The date of the issued bill in the format `dd-mm-yy`
 * @property {string} type.required - The type of the bill: `water` or `power` or `internet` or `misc`
 * @property {Number} total_amount.required - The total dollar amount of the bill
 * @property {string} reference_name - The  reference name to use for the payment of this bill
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
        return /\d\d-\d\d-\d\d/.test(date);
      },
    },
  },
  type: { type: String, required: true, enum: Object.values(BillType) },
  total_amount: {
    type: Number,
    required: true,
    min: [0, "Amount must be a positive number"],
  },
  reference_name: String,
  is_admin_confirmed: { type: Boolean, default: false },
  is_deleted: { type: Boolean, default: false },
  files: [FileSchema],
  payments: [BillPaymentSchema],
});

// Update the list of payments with the latest calculation
BillSchema.methods.calculatePayments = function () {
  const totalUsageInDays = this.payments
    .map((p) => p.usage_in_days)
    .reduce((a, b) => a + b);

  this.payments.forEach((p) => {
    const { usage_in_days } = p;

    const amountToPay = this.total_amount * (usage_in_days / totalUsageInDays);
    p.payable_amount = amountToPay;
  });
};

// Generates the reference using the date and type
BillSchema.methods.generateReference = function () {
  this.reference_name = this.type + "-" + this.date;
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
