const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const File = require("./File");
const BillPayment = require("./Payment");

/**
 * @typedef Bill
 * @property {string} date.required - The date of the issued bill
 * @property {string} type.required - The type of the bill: `water` or `power` or `internet` or `misc`
 * @property {Number} total_amount.required - The total dollar amount of the bill
 * @property {string} reference_name - The  reference name to use for the payment of this bill
 * @property {Boolean} is_deleted - True if the bill has been deleted
 * @property {Array.<File>} files - Files attached to the bill
 * @property {Array.<BillPayment>} payments - The payment requests issued from this bill
 */
const BillSchema = new Schema({
  date: { type: Date, required: true },
  type: { type: String, required: true, enum: Object.values(BillType) },
  total_amount: { type: Number, required: true },
  reference_name: { type: String },
  is_deleted: { type: Boolean, default: true },
  files: [File],
  payments: [BillPayment],
});

const BillType = Object.freeze({
  Water: "water",
  Power: "power",
  Internet: "internet",
  Misc: "misc",
});

module.exports = mongoose.model("Bill", BillSchema);
