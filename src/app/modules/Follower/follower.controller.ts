import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TImageFiles } from '../../interfaces/image.interface';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { FollowServices } from './follower.service';

const followUser = catchAsync(async (req, res) => {
  const { _id } = req.user;
  const { followingUserId } = req.body;
  const comment = await FollowServices.followUser(_id, followingUserId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Successfully followed user',
    data: comment,
  });
});

const unFollowUser = catchAsync(async (req, res) => {
  const { _id } = req.user;
  const { followingUserId } = req.body;
  const comments = await FollowServices.unFollowUser(_id, followingUserId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Successfully unfollowed user',
    data: comments,
  });
});

const getFollowers = catchAsync(async (req, res) => {
  const { _id } = req.user;
  const updatedItem = await FollowServices.getFollowers(_id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Successfully get followers',
    data: updatedItem,
  });
});

const getFollowingUser = catchAsync(async (req, res) => {
  const { _id } = req.user;
  const result = await FollowServices.getFollowingUsers(_id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Successfully get following users',
    data: result,
  });
});

export const FollowController = {
  followUser,
  unFollowUser,
  getFollowers,
  getFollowingUser,
};
