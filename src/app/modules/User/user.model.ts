/* eslint-disable no-useless-escape */
import bcryptjs from "bcryptjs";
import { Schema, model } from "mongoose";
import config from "../../config";
import { USER_ROLE, USER_STATUS } from "./user.constant";
import { IUserModel, TUser } from "./user.interface";

const userSchema = new Schema<TUser, IUserModel>(
  {
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: Object.keys(USER_ROLE),
      required: true,
    },
    email: {
      type: String,
      required: true,
      //validate email
      match: [
        /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
        "Please fill a valid email address",
      ],
    },
    password: {
      type: String,
      required: true,
      select: 0,
    },

    passwordChangedAt: {
      type: Date,
    },
    mobileNumber: {
      type: String,
      required: true,
    },

    profilePhoto: {
      type: String,
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isTopGardener: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    virtuals: true,
  }
);

userSchema.pre("save", async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this; // doc
  // hashing password and save into DB

  user.password = await bcryptjs.hash(
    user.password,
    Number(config.bcrypt_salt_rounds)
  );

  next();
});

// set '' after saving password
userSchema.post("save", function (doc, next) {
  doc.password = "";
  next();
});

userSchema.pre("find", function (next) {
  // Apply the `isDeleted: false` filter to every find query
  this.where({ isDeleted: false });
  next();
});
userSchema.pre("findOne", function (next) {
  // Apply the `isDeleted: false` filter to every find query
  this.where({ isDeleted: false });
  next();
});

userSchema.statics.isUserExistsByEmail = async function (email: string) {
  return await User.findOne({ email }).select("+password");
};

userSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashedPassword
) {
  return await bcryptjs.compare(plainTextPassword, hashedPassword);
};

userSchema.statics.isJWTIssuedBeforePasswordChanged = function (
  passwordChangedTimestamp: number,
  jwtIssuedTimestamp: number
) {
  const passwordChangedTime =
    new Date(passwordChangedTimestamp).getTime() / 1000;
  return passwordChangedTime > jwtIssuedTimestamp;
};

export const User = model<TUser, IUserModel>("User", userSchema);
