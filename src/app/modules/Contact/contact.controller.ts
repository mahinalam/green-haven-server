import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ContactServices } from "./contact.service";

const createContact = catchAsync(async (req, res) => {
  const { _id } = req.user;
  const comment = await ContactServices.createContacIntoDB(_id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Message sent successfully",
    data: comment,
  });
});

export const ContactController = {
  createContact,
};
