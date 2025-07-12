/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { User } from '../User/user.model';
import { ObjectId } from 'mongoose';
import { Follow } from './follower.model';

// follow user
const followUser = async (
  follower: string | ObjectId,
  following: string | ObjectId
) => {
  // check is following user exists
  const isFollwerExists = await User.findById(following);
  if (!isFollwerExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Follwing user does not exists!');
  }
  // check is already follow or not
  const checkFollower = await Follow.findOne({ follower, following });

  if (checkFollower) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Follwer already exists!');
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
    throw new AppError(httpStatus.NOT_FOUND, 'Follwing user does not exists!');
  }
  // check is follower exists
  const checkFollower = await Follow.findOne({ follower, following });

  if (!checkFollower) {
    throw new AppError(httpStatus.NOT_FOUND, 'Follwer does not exists!');
  }

  const result = await Follow.findOneAndDelete({
    follower,
    following,
  });
  return result;
};

// Get followers of a user
const getFollowers = async (userId: string) => {
  const result = await Follow.find({ following: userId }).populate('follower');
  return result;
};

//  Get users someone is following
const getFollowingUsers = async (userId: string) => {
  //   const result = await Follow.find({ follower: userId }).populate('following');
  const result = await Follow.find({ follower: userId }).populate({
    path: 'following',
    select: '_id name role email mobileNumber profilePhoto',
  });
  return result;
};

export const FollowServices = {
  followUser,
  unFollowUser,
  getFollowers,
  getFollowingUsers,
};
