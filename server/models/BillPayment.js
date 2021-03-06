const mongoose = require("mongoose");
const { UserSchema } = require("./User");
const Schema = mongoose.Schema;

const PaymentStatus = Object.freeze({
  Unpaid: "unpaid",
  MarkedAsPaid: "marked",
  Paid: "paid",
});

/**
 * @typedef BillPayment
 * @property {String} userId.required - The id of the user that the payment was issued to
 * @property {String} status - The status of the payment: `unpaid` or `marked` or `paid`
 * @property {Number} usage_in_days.required - The bill usage in days between `0` and `31` inclusive
 * @property {Number} payable_amount.required - The payable amount for this user in dollars
 */
const BillPaymentSchema = new Schema({
  userId: { type: String, required: true },
  status: {
    type: String,
    default: PaymentStatus.Unpaid,
    enum: Object.values(PaymentStatus),
  },
  usage_in_days: {
    type: Number,
    required: true,
    min: [0, "Days must be a positive number"],
  },
  payable_amount: { type: Number, required: true },
});

// Updates the modifiable fields with updated bill payment
BillPaymentSchema.methods.update = function (updatedPayment) {
  const { status, usage_in_days } = updatedPayment;
  if (status) {
    this.status = status;
  }

  if (usage_in_days) {
    this.usage_in_days = usage_in_days;
  }
};

module.exports = {
  PaymentStatus: PaymentStatus,
  BillPayment: mongoose.model("BillPayment", BillPaymentSchema),
  BillPaymentSchema: BillPaymentSchema,
};
