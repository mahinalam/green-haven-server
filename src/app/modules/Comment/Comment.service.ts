import httpStatus from 'http-status';
import { QueryBuilder } from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import GardeningPost from '../GardeningPost/GardeningPost.model';
import { IComment } from './Comment.interface';
import Comment from './Comment.model';

// const createCommentIntoDB = async (payload: IComment) => {
//   //   console.log(payload);

//   const result = await Comment.create(payload);
//   console.log(result);
//   // update comment in gardening post
//   const updateGardeningPostCommentField = await GardeningPost.findByIdAndUpdate(
//     payload.post,
//     { $addToSet: { comments: result?._id } }
//   );

//   return result;
// };

import { startSession } from 'mongoose';

const createCommentIntoDB = async (payload: IComment) => {
  const session = await startSession();
  session.startTransaction();

  try {
    // Create the comment
    const result = await Comment.create([payload], { session });

    if (!result || result.length === 0) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create comment');
    }

    // Update the GardeningPost by adding the comment _id to the comments array
    const updateGardeningPostCommentField =
      await GardeningPost.findByIdAndUpdate(
        payload.post,
        { $addToSet: { comments: result[0].user } }, // Add the comment _id
        { new: true, session } // `new: true` returns the updated document
      );

    if (!updateGardeningPostCommentField) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Failed to update GardeningPost with the new comment'
      );
    }

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return result[0]; // Return the created comment
  } catch (error) {
    // Abort the transaction in case of error
    await session.abortTransaction();
    session.endSession();

    // Log and rethrow the error for further handling
    console.error('Error creating comment and updating post:', error);
    throw error;
  }
};

const getAllCommentsFromDB = async (query: Record<string, unknown>) => {
  const commentQuery = new QueryBuilder(
    Comment.find().populate('user').populate('post'),
    query
  )
    .filter()
    .sort()
    // .paginate()
    .fields();

  const result = await commentQuery.modelQuery;

  return result;
};

const updateCommentIntoDB = async (
  commentId: string,
  payload: Partial<IComment>
) => {
  const result = await Comment.findByIdAndUpdate(commentId, payload, {
    new: true,
  });
  return result;
};

const deleteCommentFromDB = async (commentId: string) => {
  const result = await Comment.findByIdAndUpdate(commentId, {
    isDeleted: true,
    new: true,
  });
  return result;
};

export const CommentServices = {
  createCommentIntoDB,
  getAllCommentsFromDB,
  updateCommentIntoDB,
  deleteCommentFromDB,
};
