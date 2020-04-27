import mongoose, { Schema, Document} from "mongoose"

export interface IUser extends Document {
  name: string,
  email_address: string,
  is_deleted: boolean
};

/**
 * @typedef User
 * @property {string} name.required - The name of the user
 * @property {string} email_address.required - The email address
 * @property {Boolean} is_deleted - True if the user has been deleted
 */
const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email_address: { type: String, required: true },
  is_deleted: { type: Boolean, default: false },
});

export default mongoose.model<IUser>('User', UserSchema);
