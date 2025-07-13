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

  const result = await Follow.findOneAndDelete(
    {
      follower,
      following,
    },
    { new: true }
  );
  return result;
};

// Get followers of a user
// const getFollowersAndFollowingUserFromDB = async (userId: string) => {
//   const followers = await Follow.find({ following: userId }).populate({
//     path: 'follower',
//     select: '_id name role email mobileNumber profilePhoto',
//   });
//   const following = await Follow.find({ follower: userId }).populate({
//     path: 'following',
//     select: '_id name role email mobileNumber profilePhoto',
//   });

//   return { followers: followers, followingUser: following };
// };
const getFollowersAndFollowingUserFromDB = async (userId: string) => {
  const followers = await Follow.find({ following: userId }).populate({
    path: 'follower',
    select: '_id name profilePhoto email role',
  });

  const following = await Follow.find({ follower: userId }).populate({
    path: 'following',
    select: '_id name profilePhoto email role',
  });

  return { followers, followingUser: following };
};

export const FollowServices = {
  followUser,
  unFollowUser,
  getFollowersAndFollowingUserFromDB,
};
