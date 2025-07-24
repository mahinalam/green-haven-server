/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { User } from "../User/user.model";
import { ObjectId } from "mongoose";
import { Follow } from "./follower.model";

// follow user
const followUser = async (
  follower: string | ObjectId,
  following: string | ObjectId
) => {
  // check is following user exists
  const isFollwerExists = await User.findById(following);
  if (!isFollwerExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Follwing user does not exists!");
  }
  // check is already follow or not
  const checkFollower = await Follow.findOne({ follower, following });

  if (checkFollower) {
    throw new AppError(httpStatus.BAD_REQUEST, "Follwer already exists!");
  }

  const result = await Follow.create({ follower, following });
  return result;
};

// unfollow user
const unFollowUser = async (
  follower: string | ObjectId,
  following: string | ObjectId
) => {
  // check is following user exists
  const isFollwerExists = await User.findById(following);
  if (!isFollwerExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Follwing user does not exists!");
  }
  // check is follower exists
  const checkFollower = await Follow.findOne({ follower, following });

  if (!checkFollower) {
    throw new AppError(httpStatus.NOT_FOUND, "Follwer does not exists!");
  }

  const result = await Follow.findOneAndDelete(
    {
      follower,
      following,
    },
    { new: true }
  );
  return result;
};

const getFollowersAndFollowingUserFromDB = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError(httpStatus.NOT_FOUND, "User does not exists!");

  const followers = await Follow.find({ following: userId })
    .populate({
      path: "follower",
      select: "_id name profilePhoto email role",
    })
    .select("_id");

  const following = await Follow.find({ follower: userId })
    .populate({
      path: "following",
      select: "_id name profilePhoto email role",
    })
    .select("_id");

  console.log({ following });
  return { followers, followingUser: following };
};

// remove follower
const removeFollower = async (
  following: string | ObjectId,
  follower: string | ObjectId
) => {
  // check is following user exists
  const isFollwerExists = await User.findById(follower);
  if (!isFollwerExists) {
    throw new AppError(httpStatus.NOT_FOUND, "User does not exists!");
  }
  // check is follower exists
  const checkFollower = await Follow.findOne({ follower, following });
  console.log({ follower, following });
  if (!checkFollower) {
    throw new AppError(httpStatus.NOT_FOUND, "Follower does not exists!");
  }

  const result = await Follow.findOneAndDelete(
    {
      follower,
      following,
    },
    { new: true }
  );
  return result;
};

export const FollowServices = {
  followUser,
  unFollowUser,
  getFollowersAndFollowingUserFromDB,
  removeFollower,
};
