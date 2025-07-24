import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { FollowServices } from "./follower.service";

const followUser = catchAsync(async (req, res) => {
  const { _id } = req.user;
  const { followingUserId } = req.body;
  const comment = await FollowServices.followUser(_id, followingUserId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Successfully followed user",
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
    message: "Successfully unfollowed user",
    data: comments,
  });
});

const removeFollower = catchAsync(async (req, res) => {
  const { _id } = req.user;
  const { followerUserId } = req.body;
  const comments = await FollowServices.removeFollower(_id, followerUserId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Successfully remove follower",
    data: comments,
  });
});

const getFollowersAndFollowingUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updatedItem = await FollowServices.getFollowersAndFollowingUserFromDB(
    id
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Successfully get followers and following users.",
    data: updatedItem,
  });
});

export const FollowController = {
  followUser,
  unFollowUser,
  getFollowersAndFollowingUser,
  removeFollower,
};
