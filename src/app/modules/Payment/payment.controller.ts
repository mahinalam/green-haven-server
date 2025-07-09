import { Request, Response } from 'express';
import { paymentServices } from './payment.service';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';

const confirmationController = async (req: Request, res: Response) => {
  console.log(req.query.transactionId);
  const { transactionId, status } = req.query;

  const result = await paymentServices.confirmationService(
    transactionId as string,
    status as string
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Payment confirmation retrived successfully.',
    data: result,
  });
};

const getAllPayments = async (req: Request, res: Response) => {
  const result = await paymentServices.getAllPaymentsFromDB();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Payment retrived successfully.',
    data: result,
  });
};

// check is user verified
const isUserVerified = async (req: Request, res: Response) => {
  const { _id } = req.user;
  const result = await paymentServices.isUserVerifiedFromDB(_id);
  if (!result) {
    sendResponse(res, {
      success: false,
      statusCode: httpStatus.FORBIDDEN,
      message: 'User is not verified.',
      data: null,
    });
  } else {
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'User is verified.',
      data: null,
    });
  }
};

export const paymentControler = {
  confirmationController,
  getAllPayments,
  isUserVerified,
};
