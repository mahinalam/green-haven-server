import { Request, Response } from "express";
import { paymentServices } from "./payment.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import config from "../../config";

const verifyProfile = catchAsync(async (req, res) => {
  const user = req.user;
  const payment = await paymentServices.verifyProfileIntoDB(user);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Profile verification on processing.",
    data: payment,
  });
});

const confirmationController = async (req: Request, res: Response) => {
  const successPayment = req.body;

  const isVerifiedSuccess = await paymentServices.confirmationService(
    successPayment
  );
  if (!isVerifiedSuccess) {
    return res.redirect(
      `${config.payment_cancel_url}/verify/failed?token=${config.valid_failed_token}`
    );
  }
  return res.redirect(
    `${config.payment_cancel_url}/verify/success?token=${config.valid_success_token}`
  );
};

const getAllPayments = async (req: Request, res: Response) => {
  const result = await paymentServices.getAllPaymentsFromDB(req.query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Payments retrived successfully.",
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
      message: "User is not verified.",
      data: null,
    });
  } else {
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User is verified.",
      data: null,
    });
  }
};

const deletePayment = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await paymentServices.deletePaymentFromDB(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Payment deleted successfully.",
    data: result,
  });
};

export const paymentControler = {
  confirmationController,
  getAllPayments,
  isUserVerified,
  deletePayment,
  verifyProfile,
};
