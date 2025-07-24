import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { UserServices } from "./user.service";
import { TImageFile } from "../../interfaces/image.interface";

const userRegister = catchAsync(async (req, res) => {
  const user = await UserServices.createUser(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User Created Successfully",
    data: user,
  });
});

const checkFollower = catchAsync(async (req, res) => {
  const { followerId, followingId } = req.body;
  const user = await UserServices.checkFollower(followerId, followingId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Successfully checked follower.",
    data: user,
  });
});

const getAllUsers = catchAsync(async (req, res) => {
  const users = await UserServices.getAllUsersFromDB(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Users Retrieved Successfully",
    data: users,
  });
});

const getSingleUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const user = await UserServices.getSingleUserFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User Retrieved Successfully",
    data: user,
  });
});

const deleteUser = catchAsync(async (req, res) => {
  const user = await UserServices.deleteUserFromDB(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User deleted Successfully",
    data: user,
  });
});

// get user stats
const userStats = catchAsync(async (req, res) => {
  const { _id, role } = req.user;
  const user = await UserServices.getUserStatsFromDB(_id, role);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User stats retrived Successfully",
    data: user,
  });
});

// update profile
const updateMyProfile = catchAsync(async (req, res) => {
  const { _id } = req.user;
  const result = await UserServices.updateMyProfile(
    _id,
    req.body,
    req.file as TImageFile
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Profile updated successfully",
    data: result,
  });
});
const createTopGardener = catchAsync(async (req, res) => {
  const { userId } = req.body;
  const result = await UserServices.createTopGardenerIntoDB(userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Top Gardener created successfully",
    data: result,
  });
});
const deleteTopGardener = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await UserServices.deleteTopGardenerFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Top Gardener deleted successfully.",
    data: result,
  });
});

export const UserControllers = {
  getSingleUser,
  userRegister,
  getAllUsers,
  checkFollower,
  deleteUser,
  userStats,
  updateMyProfile,
  createTopGardener,
  deleteTopGardener,
};
