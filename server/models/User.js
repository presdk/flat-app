const mongoose = require("mongoose");

const Schema = mongoose.Schema;

/**
 * @typedef User
 * @property {string} name.required - The name of the user
 * @property {string} email_address.required - The email address
 * @property {Boolean} is_deleted - True if the user has been deleted
 */
const UserSchema = new Schema({
  name: { type: String, required: true },
  email_address: { type: String, required: true },
  is_deleted: { type: Boolean, default: false },
});

module.exports = mongoose.model('User', UserSchema);
