/* eslint-disable no-unused-vars */
import { Model, ObjectId } from "mongoose";
import { USER_ROLE, USER_STATUS } from "./user.constant";

export type TUser = {
  _id?: ObjectId | string;
  name: string;
  role: keyof typeof USER_ROLE;
  email: string;
  password: string;
  status: keyof typeof USER_STATUS;
  passwordChangedAt?: Date;
  followers: ObjectId[];
  following: ObjectId[];
  mobileNumber?: string;
  profilePhoto?: string;
  createdAt?: Date;
  updatedAt?: Date;
  isDeleted: boolean;
  isVerified: boolean;
  isTopGardener: boolean;
};

export interface IUserModel extends Model<TUser> {
  isUserExistsByEmail(id: string): Promise<TUser>;
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string
  ): Promise<boolean>;
  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number
  ): boolean;
}
