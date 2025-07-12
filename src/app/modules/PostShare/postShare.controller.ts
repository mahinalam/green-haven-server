import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TImageFiles } from '../../interfaces/image.interface';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { PostShareService } from './postShare.service';

// get all posts
const getSharePost = catchAsync(async (req, res) => {
  const { postId } = req.params;
  const { _id } = req.user;
  const item = await PostShareService.getSharePost(postId, _id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Shared post retrieved successfully',
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
    message: 'Shared post created successfully',
    data: item,
  });
});

export const PostShareController = {
  createPostShare,
  getSharePost,
};
