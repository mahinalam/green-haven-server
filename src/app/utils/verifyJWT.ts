/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt, { JwtPayload } from "jsonwebtoken";
import AppError from "../errors/AppError";
import { USER_ROLE, USER_STATUS } from "../modules/User/user.constant";
import { ObjectId } from "mongoose";

export const createToken = (
  jwtPayload: {
    _id?: string | ObjectId;
    name: string;
    email: string;
    mobileNumber?: string;
    role: keyof typeof USER_ROLE;
    profilePhoto?: string;
    isVerified: boolean;
  },
  secret: string,
  expiresIn: string
) => {
  return jwt.sign(jwtPayload, secret, {
    expiresIn,
  });
};

export const verifyToken = (
  token: string,
  secret: string
): JwtPayload | Error => {
  try {
    return jwt.verify(token, secret) as JwtPayload;
  } catch (error: any) {
    throw new AppError(401, "You are not authorized!");
  }
};
