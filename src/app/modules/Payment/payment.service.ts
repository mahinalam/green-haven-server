/* eslint-disable no-unused-vars */
import { join } from "path";
import { initiatePayment, verifyPayment } from "./payment.utils";
import { readFileSync } from "fs";
import { Payment } from "./payment.model";
import { User } from "../User/user.model";
import { QueryBuilder } from "../../builder/QueryBuilder";
import config from "../../config";
import axios from "axios";
import mongoose from "mongoose";

// Verify profile using ssl commerz
// step 1 -> initiate payment

const verifyProfileIntoDB = async (user: Record<string, unknown>) => {
  const { _id, name, email, mobileNumber } = user;

  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 10);
  const transactionId = `txn_${timestamp}_${randomStr}`;

  const initiate = {
    store_id: config.store_id,
    store_passwd: config.store_pass,
    total_amount: 1000,
    currency: "BDT",
    tran_id: transactionId,
    success_url: `${config.payment_success_url}`,
    fail_url: `${config.payment_fail_url}`,
    cancel_url: config.payment_cancel_url,
    ipn_url: config.payment_success_url,
    shipping_method: "Courier",
    product_name: "Computer.",
    product_category: "Electronic",
    product_profile: "general",
    cus_name: name,
    cus_email: email,
    cus_add1: "Dhaka",
    cus_add2: "Dhaka",
    cus_city: "Dhaka",
    cus_state: "Dhaka",
    cus_postcode: "1000",
    cus_country: "Bangladesh",
    cus_phone: mobileNumber,
    cus_fax: "01711111111",
    ship_name: "Customer Name",
    ship_add1: "Dhaka",
    ship_add2: "Dhaka",
    ship_city: "Dhaka",
    ship_state: "Dhaka",
    ship_postcode: 1000,
    ship_country: "Bangladesh",
  };

  const iniResponse = await axios({
    url: "https://sandbox.sslcommerz.com/gwprocess/v4/api.php",
    method: "POST",
    data: initiate,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  const paymentInfoSavedToDB = {
    transactionId,
    userId: _id,
    totalPrice: 1000,
    paymentStatus: "pending",
  };
  await Payment.create(paymentInfoSavedToDB);

  const gatewayUrl = iniResponse?.data?.GatewayPageURL;
  return { gatewayUrl };
};

const confirmationService = async (paymentSuccess: any) => {
  // validation
  const { data } = await axios.get(
    `https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php?val_id=${paymentSuccess?.val_id}&store_id=${config.store_id}&store_passwd=${config.store_pass}`
  );
  console.log({ data });
  if (data?.status !== "VALID") {
    return false;
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // update payment status
    const result = await Payment.findOneAndUpdate(
      { transactionId: data.tran_id },
      {
        $set: {
          paymentStatus: "paid",
        },
      }
    )
      .populate({ path: "userId", select: "_id" })
      .select("_id");

    const userId = result?.userId?._id;

    // update isVerified field to user
    await User.findByIdAndUpdate(
      userId,
      { $set: { isVerified: true } },
      { new: true }
    );
    await session.commitTransaction();
    await session.endSession();

    return true;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
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
