import mongoose, { Schema } from "mongoose";
import { IContact } from "./contact.interface";

const ContactSchema: Schema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, require: true },
    isDeleted: { type: Boolean, default: false }, // Soft delete for the comment
  },
  { timestamps: true }
);

ContactSchema.pre("find", function (next) {
  // Apply the `isDeleted: false` filter to every find query
  this.where({ isDeleted: false });
  next();
});
ContactSchema.pre("findOne", function (next) {
  // Apply the `isDeleted: false` filter to every find query
  this.where({ isDeleted: false });
  next();
});

const Contact = mongoose.model<IContact>("Contact", ContactSchema);

export default Contact;
