import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserServices } from './user.service';

const userRegister = catchAsync(async (req, res) => {
  const user = await UserServices.createUser(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User Created Successfully',
    data: user,
  });
});
const followAndFollowingUser = catchAsync(async (req, res) => {
  const { followerId, followingId } = req.body;
  const user = await UserServices.followAndFollowingUserInto(
    followerId,
    followingId
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Successfully followed user.',
    data: user,
  });
});

// unfollow user
const unFollowUser = catchAsync(async (req, res) => {
  const { followerId, followingId } = req.body;
  const user = await UserServices.unFollowUserIntoDB(followerId, followingId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Successfully unfollowed user.',
    data: user,
  });
});

const checkFollower = catchAsync(async (req, res) => {
  const { followerId, followingId } = req.body;
  const user = await UserServices.checkFollower(followerId, followingId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Successfully checked follower.',
    data: user,
  });
});

const getAllUsers = catchAsync(async (req, res) => {
  const users = await UserServices.getAllUsersFromDB(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Users Retrieved Successfully',
    data: users,
  });
});

const getSingleUser = catchAsync(async (req, res) => {
  const { _id } = req.user;
  const user = await UserServices.getSingleUserFromDB(_id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User Retrieved Successfully',
    data: user,
  });
});

const deleteUser = catchAsync(async (req, res) => {
  const user = await UserServices.deleteUserFromDB(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User deleted Successfully',
    data: user,
  });
});

export const UserControllers = {
  getSingleUser,
  userRegister,
  getAllUsers,
  followAndFollowingUser,
  checkFollower,
  unFollowUser,
  deleteUser,
};
