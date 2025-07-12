/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import { QueryBuilder } from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { TImageFiles } from '../../interfaces/image.interface';
import { User } from '../User/user.model';
import { PostShare } from './postShare.model';
import GardeningPost from '../GardeningPost/GardeningPost.model';
import { IShare } from './postShare.interface';

const createSharePost = async (sharedById: string, payload: IShare) => {
  const post = await GardeningPost.findOne({ _id: payload.post });
  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post not found');
  }

  const user = await User.findOne({ _id: payload.user });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  const newPayload = { ...payload, sharedBy: sharedById };

  const result = await PostShare.create(newPayload);

  return result;
};

const getSharePost = async (postId: string, sharedById: string) => {
  const post = await GardeningPost.findOne({ _id: postId, isDeleted: false });
  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post not found');
  }

  const result = await PostShare.findOne({ sharedBy: sharedById })
    .populate({
      path: 'post',
      select: '_id images createdAt',
    })
    .populate({
      path: 'user',
      select: '_id name profilePhoto',
    });
  // .populate('user')
  // .select('_id name profilePhoto');

  return result;
};

// delete post
const deleteGardeningPost = async (postId: string) => {
  // check is gardening post exists
  const post = await GardeningPost.findOne({ _id: postId, isDeleted: false });
  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, 'Gardening post does not exixts!');
  }
  const result = await GardeningPost.updateOne(
    { _id: postId },
    { isDeleted: true }
  );
  return result;
};

export const PostShareService = {
  createSharePost,
  getSharePost,
};
