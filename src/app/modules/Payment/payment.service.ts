/* eslint-disable no-unused-vars */
import { join } from "path";
import { initiatePayment, verifyPayment } from "./payment.utils";
import { readFileSync } from "fs";
import { Payment } from "./payment.model";
import { User } from "../User/user.model";
import { QueryBuilder } from "../../builder/QueryBuilder";

// VERIFY PROFILE
const verifyProfileIntoDB = async (user: Record<string, unknown>) => {
  console.log("from service", user);
  const { _id, name, email, mobileNumber } = user;

  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 10);
  const transactionId = `txn_${timestamp}_${randomStr}`;

  const paymentData = {
    transactionId,
    totalPrice: 1000,
    customerName: name,
    customerEmail: email,
    customerMobileNumber: mobileNumber,
  };
  //   return result;

  const paymentSession = await initiatePayment(paymentData);
  //   console.log(paymentSession);

  const paymentInfoSavedToDB = {
    transactionId,
    userId: _id,
    totalPrice: 1000,
    paymentStatus: "pending",
  };
  await Payment.create(paymentInfoSavedToDB);
  return paymentSession;
};

const confirmationService = async (transactionId: string, status: string) => {
  const verifyResponse = await verifyPayment(transactionId);

  let message = "";

  if (verifyResponse && verifyResponse.pay_status === "Successful") {
    // update payment status in payment collection
    const result = await Payment.findOneAndUpdate(
      { transactionId },
      {
        paymentStatus: "paid",
      },
      { new: true }
    ).populate("userId");

    // update isVerified filed of user
    const userId = result!.userId._id;
    await User.findByIdAndUpdate(userId, { isVerified: true }, { new: true });

    message = "Your profile has been successfully verified!";
  } else {
    message = "Verification Failed!";
  }
  const filePath = join(__dirname, "../../../views/confirmation.html");
  let template = readFileSync(filePath, "utf-8");

  template = template.replace(`{{message}}`, message);

  return template;
};

const getAllPaymentsFromDB = async (query: Record<string, unknown>) => {
  const payments = new QueryBuilder(
    Payment.find().populate({
      path: "userId",
      select: "_id name email role mobileNumber profilePhoto isVerified",
    }),
    query
  )
    .filter()
    .sort()
    .fields()
    .paginate();
  const result = await payments.execWithMeta();
  return result;
};

// check is user verified
const isUserVerifiedFromDB = async (userId: string) => {
  const result = await Payment.findOne({ userId });
  return result;
};

const deletePaymentFromDB = async (categoryId: string) => {
  await Payment.findByIdAndUpdate(categoryId, {
    isDeleted: true,
    new: true,
  });
  return null;
};

export const paymentServices = {
  confirmationService,
  getAllPaymentsFromDB,
  isUserVerifiedFromDB,
  deletePaymentFromDB,
  verifyProfileIntoDB,
};
