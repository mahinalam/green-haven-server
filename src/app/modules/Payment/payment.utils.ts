/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import dotenv from "dotenv";
import config from "../../config";
dotenv.config();

export const initiatePayment = async (paymentData: any) => {
  const response = await axios.post(process.env.PAYMENT_URL as string, {
    store_id: process.env.STORE_ID,
    signature_key: process.env.SIGNATURE_KEY,
    tran_id: paymentData.transactionId,
    success_url: `${config.payment_success_url}?transactionId=${paymentData.transactionId}&status=success`,
    fail_url: `${config.payment_fail_url}?status=failed`,
    cancel_url: config.payment_cancel_url,
    amount: paymentData.totalPrice,
    currency: "BDT",
    desc: "Merchant Registration Payment",
    cus_name: paymentData.customerName,
    cus_email: paymentData.customerEmail,
    cus_add1: "N/A",
    cus_add2: "N/A",
    cus_city: "N/A",
    cus_state: "Dhaka",
    cus_postcode: "N/A",
    cus_country: "N/A",
    cus_phone: paymentData.customerMobileNumber,
    type: "json",
  });
  return response.data;
};

export const verifyPayment = async (tnxId: string) => {
  try {
    const response = await axios.get(process.env.PAYMENT_VERIFY_URL!, {
      params: {
        store_id: process.env.STORE_ID,
        signature_key: process.env.SIGNATURE_KEY,
        type: "json",
        request_id: tnxId,
      },
    });

    return response.data;
  } catch (err) {
    throw new Error("Payment validation failed!");
  }
};
