const mongoose = require("mongoose");
const User = require("./User");
const Schema = mongoose.Schema;

/**
 * @typedef Payment
 * @property {User} user.required - The user that the payment was issued to
 * @property {String} status - The status of the payment: `unpaid` or `marked` or `paid`
 * @property {Number} split_ratio.required - The ratio to split the bill by between `0` and `1`
 */
const PaymentSchema = new Schema({
  user: { type: User, required: true },
  status: {
    type: String,
    default: PaymentStatus.UnPaid,
    enum: Object.values(PaymentStatus),
  },
  split_ratio: { type: Number, required: true },
  split_amount: Number,
});

const PaymentStatus = Object.freeze({
  UnPaid: "unpaid",
  MarkedAsPaid: "marked",
  Paid: "paid",
});

module.exports = mongoose.model("Payment", PaymentSchema);
