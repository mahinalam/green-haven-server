/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import { QueryBuilder } from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { TImageFiles } from '../../interfaces/image.interface';
import { User } from '../User/user.model';
import { IReaction } from './reaction.interface';
import Reaction from './reaction.model';
import GardeningPost from '../GardeningPost/GardeningPost.model';
import { ObjectId, Types } from 'mongoose';

export const getReactionCounts = async (postId: ObjectId | string) => {
  console.log({ postId });
  const objectId = new Types.ObjectId(postId);

  const result = await Reaction.aggregate([
    {
      $match: {
        post: objectId,
        isDeleted: false,
      },
    },
    {
      $group: {
        _id: '$type', // group by "like" or "dislike"
        count: { $sum: 1 },
      },
    },
  ]);

  // Convert array to object: { like: X, dislike: Y }
  const counts = { like: 0, dislike: 0 };
  result.forEach((r) => {
    (counts as any)[r._id] = r.count;
  });

  return counts;
};

const createReaction = async (
  userId: ObjectId | string,
  payload: Partial<IReaction>
) => {
  // check is post exists
  const post = await GardeningPost.findOne({
    _id: payload.post as any,
    isDeleted: false,
  });

  // if not throw exception
  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post not exists!');
  }

  // check is reaction exists
  const reaction = await Reaction.findOne({
    post: payload.post,
    user: userId,
  });

  // if exists through error
  if (reaction) {
    throw new AppError(httpStatus.NOT_FOUND, 'Reaction already given!');
  }

  const newReaction = {
    ...payload,
    user: userId,
  };
  // create reaction
  const result = await Reaction.create(newReaction);
  return result;
};

export const ReactionService = {
  getReactionCounts,
  createReaction,
};
