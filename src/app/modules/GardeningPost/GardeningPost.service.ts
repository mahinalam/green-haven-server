/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import { QueryBuilder } from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { TImageFiles } from '../../interfaces/image.interface';
import { IGardeningPost } from './GardeningPost.interface';
import GardeningPost from './GardeningPost.model';
import { User } from '../User/user.model';

const createGardeningPostIntoDB = async (
  payload: IGardeningPost,
  images: TImageFiles
) => {
  const { itemImages } = images;
  payload.images = itemImages.map((image) => image.path);

  const result = await GardeningPost.create(payload);

  return result;
};

const getAllGardeningPostsFromDB = async (query: Record<string, unknown>) => {
  const gardeningPostQuery = new QueryBuilder(
    GardeningPost.find().populate('user').populate('category'),
    query
  )
    .filter()
    .sort()
    // .paginate()
    .fields();

  const result = await gardeningPostQuery.modelQuery;

  return result;
};

// const getAllGardeningPostsFromDB = async () => {
//   const result = await GardeningPost.find().populate('user');
//   // .populate('category');
//   return result;
// };

const getUserGardeningPostsFromDB = async (userId: string) => {
  const result = await GardeningPost.find({ user: userId }).populate('user');
  // .populate('category');
  return result;
};

const getSingleGardeningPostFromDB = async (postId: string) => {
  const result = await GardeningPost.findById(postId)
    .populate('user')
    // .populate('category');
    .populate('comments');
  return result;
};

const updateGardeningPostInDB = async (
  postId: string,
  payload: Partial<IGardeningPost>
) => {
  const result = await GardeningPost.findByIdAndUpdate(postId, payload, {
    new: true,
  });
  // if (result) {
  //   await addDocumentToIndex(result, 'items');
  // } else {
  //   throw new Error(`Item with ID ${itemId} not found.`);
  // }
  return result;
};

const updatePostLikeStatusIntoDB = async (
  postId: string,
  userId: string,
  status: string
) => {
  const isAlredayVoted = await GardeningPost.findById(postId);
  if (!isAlredayVoted) {
    throw new AppError(httpStatus.NOT_FOUND, 'Gardening post does not exixts!');
  }

  const isPostAlredayDeleted = isAlredayVoted.isDeleted;
  if (isPostAlredayDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'Gardening post alreday deleted!');
  }
  const isUserExists = await User.findById(userId);

  if (!isUserExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'User does not exists!');
  }

  const isDeletedUser = isUserExists.isDeleted;
  if (isDeletedUser) {
    throw new AppError(httpStatus.NOT_FOUND, 'User alreday deleted!');
  }
  const isUpVotesExists =
    (isAlredayVoted as any).upVotes.length > 0
      ? (isAlredayVoted as any).upVotes.filter((vote: string) => {
          return String(vote) === String(userId);
        })
      : false;

  const isDownVotesExists =
    (isAlredayVoted as any).downVotes.length > 0
      ? (isAlredayVoted as any).downVotes.filter((vote: string) => {
          return String(vote) === String(userId);
        })
      : false;

  if (isUpVotesExists || isDownVotesExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'User vote alreday exists!');
  }

  const updateField =
    status === 'like' ? { upVotes: userId } : { downVotes: userId };

  const result = await GardeningPost.findByIdAndUpdate(
    postId,
    {
      $addToSet: updateField, // Conditionally update upVotes or downVotes
    },
    { new: true }
  );

  return result;
};

// const updatePostLikeStatusIntoDB = async (
//   postId: string,
//   userId: string,
//   status: string
// ) => {
//   // Fetch the post to check if it exists
//   const post = await GardeningPost.findById(postId);
//   if (!post) {
//     throw new AppError(httpStatus.NOT_FOUND, 'Gardening post does not exist!');
//   }

//   console.log('post', post);

//   // Check if the post has been deleted
//   if (post.isDeleted) {
//     throw new AppError(httpStatus.NOT_FOUND, 'Gardening post already deleted!');
//   }

//   // Fetch the user to check if they exist
//   const user = await User.findById(userId);
//   console.log('user', user);
//   if (!user) {
//     throw new AppError(httpStatus.NOT_FOUND, 'User does not exist!');
//   }

//   // Check if the user has been deleted
//   if (user.isDeleted) {
//     throw new AppError(httpStatus.NOT_FOUND, 'User already deleted!');
//   }

//   // Check if the user has already upvoted the post
//   const hasUpVoted = post.upVotes.some((vote: string) => vote === userId);

//   // Check if the user has already downvoted the post
//   const hasDownVoted = post.downVotes.some((vote: string) => vote === userId);

//   console.log('hasUpVoted', hasUpVoted);
//   console.log('hasDownVoted', hasDownVoted);

//   // If the user has already voted (either up or down), throw an error
//   if (hasUpVoted || hasDownVoted) {
//     throw new AppError(httpStatus.BAD_REQUEST, 'User vote already exists!');
//   }

//   // Prepare the field to update based on the status (like/dislike)
//   const updateField =
//     status === 'like' ? { upVotes: userId } : { downVotes: userId };

//   // Update the post by adding the userId to either upVotes or downVotes
//   const result = await GardeningPost.findByIdAndUpdate(
//     postId,
//     {
//       $addToSet: updateField, // Add userId to the appropriate field (upVotes or downVotes)
//     },
//     { new: true }
//   );

//   return result;
// };

export const GardeningPostServices = {
  createGardeningPostIntoDB,
  getAllGardeningPostsFromDB,
  getSingleGardeningPostFromDB,
  getUserGardeningPostsFromDB,
  updateGardeningPostInDB,
  // deleteGardeningPostFromDB,
  updatePostLikeStatusIntoDB,
};
