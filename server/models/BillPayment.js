const mongoose = require("mongoose");
const User = require("./User");
const Schema = mongoose.Schema;

/**
 * @typedef BillPayment
 * @property {User.model} user.required - The user that the payment was issued to
 * @property {String} status.required - The status of the payment: `unpaid` or `marked` or `paid`
 * @property {Number} usage_in_days.required - The bill usage in days between `0` and `31` inclusive
 * @property {Number} payable_amount.required - The payable amount for this user in dollars
 */
const BillPaymentSchema = new Schema({
  user: { type: User, required: true },
  status: {
    type: String,
    default: PaymentStatus.UnPaid,
    enum: Object.values(PaymentStatus),
  },
  usage_in_days: { type: Number, required: true },
  payable_amount: Number,
});

const PaymentStatus = Object.freeze({
  UnPaid: "unpaid",
  MarkedAsPaid: "marked",
  Paid: "paid",
});

module.exports = mongoose.model("BillPayment", BillPaymentSchema);
