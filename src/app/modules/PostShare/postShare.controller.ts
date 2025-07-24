import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { PostShareService } from "./postShare.service";

// get all posts
const getSharePost = catchAsync(async (req, res) => {
  const item = await PostShareService.getSharePost();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Shared post retrieved successfully",
    data: item,
  });
});

// get single post
const createPostShare = catchAsync(async (req, res) => {
  const { _id } = req.user;
  const item = await PostShareService.createSharePost(_id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Shared post created successfully",
    data: item,
  });
});

export const PostShareController = {
  createPostShare,
  getSharePost,
};
