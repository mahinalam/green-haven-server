import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';
import { catchAsync } from '../../utils/catchAsync';

import { VerifyProfileServices } from './verify.service';

const verifyProfile = catchAsync(async (req, res) => {
  const user = req.user;
  const payment = await VerifyProfileServices.verifyProfileIntoDB(user);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Profile verification on processing.',
    data: payment,
  });
});

export const VerifyProfileControllers = {
  verifyProfile,
};
