import { Payment } from '../Payment/payment.model';
import { initiatePayment } from '../Payment/payment.utils';

const verifyProfileIntoDB = async (user: Record<string, unknown>) => {
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
    paymentStatus: 'pending',
  };
  await Payment.create(paymentInfoSavedToDB);
  return paymentSession;
};

export const VerifyProfileServices = {
  verifyProfileIntoDB,
};
