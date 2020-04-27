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

// Returns a list of active users
UserSchema.statics.getActiveUsers = async () => {
  return User.find({ is_deleted: false });
};

const User = mongoose.model("User", UserSchema);

module.exports = {
  User: User,
  UserSchema: UserSchema,
};
