import httpStatus from 'http-status';
import { QueryBuilder } from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { UserSearchableFields } from './user.constant';
import { TUser } from './user.interface';
import { User } from './user.model';
import { ObjectId } from 'mongoose';

const createUser = async (payload: TUser) => {
  const user = await User.create(payload);

  return user;
};

const followAndFollowingUserInto = async (
  followerId: ObjectId | string,
  followingId: ObjectId | string
) => {
  const isFollowerExists = await User.findById(followerId);
  if (!isFollowerExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'User does not exists!');
  }

  const isFollowingUserExists = await User.findById(followingId);
  if (!isFollowingUserExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'User does not exists!');
  }
  console.log('isFollowingUserExists', isFollowingUserExists);
  const isAlreadyFollowed = isFollowingUserExists.followers.some(
    (follower: ObjectId) => follower.toString() === followerId.toString()
  );
  console.log(isAlreadyFollowed);
  if (isAlreadyFollowed) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'User already in your follower lists!'
    );
  }

  const followers = await User.findByIdAndUpdate(
    followerId,
    {
      $addToSet: { following: followingId },
    },
    { new: true }
  );
  const following = await User.findByIdAndUpdate(
    followingId,
    {
      $addToSet: { followers: followerId },
    },
    { new: true }
  );

  return { followers, following };
};

const unFollowUserIntoDB = async (
  followerId: ObjectId | string,
  followingId: ObjectId | string
) => {
  const isFollowerExists = await User.findById(followerId);
  if (!isFollowerExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'User does not exists!');
  }

  const isFollowingUserExists = await User.findById(followingId);
  if (!isFollowingUserExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'User does not exists!');
  }

  const isAlreadyFollowed = isFollowingUserExists.followers.some(
    (follower: ObjectId) => follower.toString() === followerId.toString()
  );
  console.log(isAlreadyFollowed);
  if (!isAlreadyFollowed) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'User does not exists on your follower lists!'
    );
  }

  const followers = await User.findByIdAndUpdate(
    followerId,
    {
      $pull: { following: followingId },
    },
    { new: true }
  );
  const following = await User.findByIdAndUpdate(
    followingId,
    {
      $pull: { followers: followerId },
    },
    { new: true }
  );

  return { followers, following };
};

const checkFollower = async (
  followerId: ObjectId | string,
  followingId: ObjectId | string
) => {
  const isFollowerExists = await User.findById(followerId);
  if (!isFollowerExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'User does not exists!');
  }

  const isFollowingUserExists = await User.findById(followingId);
  if (!isFollowingUserExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'User does not exists!');
  }

  const isAlreadyFollowed = isFollowingUserExists.followers.some(
    (follower: ObjectId) => follower.toString() === followerId.toString()
  );
  return isAlreadyFollowed;
};

const getAllUsersFromDB = async (query: Record<string, unknown>) => {
  const users = new QueryBuilder(User.find(), query)
    .fields()
    .paginate()
    .sort()
    .filter()
    .search(UserSearchableFields);

  const result = await users.modelQuery;

  return result;
};

const getSingleUserFromDB = async (id: string) => {
  const user = await User.findById(id).select(
    '_id name role email profilePhoto mobileNumber'
  );
  console.log('user', user);
  return user;
};

const deleteUserFromDB = async (userId: string) => {
  const result = await User.findByIdAndUpdate(
    userId,
    {
      isDeleted: true,
    },
    { new: true }
  );

  return result;
};

export const UserServices = {
  createUser,
  getAllUsersFromDB,
  getSingleUserFromDB,
  followAndFollowingUserInto,
  unFollowUserIntoDB,
  checkFollower,
  deleteUserFromDB,
};
