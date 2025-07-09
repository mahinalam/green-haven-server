/* eslint-disable no-unused-vars */
import { join } from 'path';
// import orderModel from '../order/order.model';
import { verifyPayment } from './payment.utils';
import { readFileSync } from 'fs';
import { Payment } from './payment.model';
import { User } from '../User/user.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const confirmationService = async (transactionId: string, status: string) => {
  const verifyResponse = await verifyPayment(transactionId);

  console.log('verifyResponse hi', verifyResponse);

  let message = '';

  if (verifyResponse && verifyResponse.pay_status === 'Successful') {
    // update payment status in payment collection
    const result = await Payment.findOneAndUpdate(
      { transactionId },
      {
        paymentStatus: 'paid',
      },
      { new: true }
    ).populate('userId');

    console.log(result);

    // update isVerified filed of user
    const userId = result!.userId._id;
    await User.findByIdAndUpdate(userId, { isVerified: true }, { new: true });

    message = 'Successfully Paid!';
  } else {
    message = 'Payment Failed!';
  }
  const filePath = join(__dirname, '../../../views/confirmation.html');
  let template = readFileSync(filePath, 'utf-8');

  template = template.replace(`{{message}}`, message);

  return template;
};

const getAllPaymentsFromDB = async () => {
  const result = await Payment.find().populate('userId');
  // .populate('category');
  return result;
};

// check is user verified
const isUserVerifiedFromDB = async (userId: string) => {
  const result = await Payment.findOne({ userId });
  return result;
};

export const paymentServices = {
  confirmationService,
  getAllPaymentsFromDB,
  isUserVerifiedFromDB,
};
