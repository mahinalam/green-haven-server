/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import { QueryBuilder } from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { TImageFiles } from '../../interfaces/image.interface';
import { User } from '../User/user.model';
import { IGuide } from './Blogs.interface';
import Guide from './Blogs.model';
import { ObjectId } from 'mongoose';
import Blog from './Blogs.model';

const createGuideIntoDB = async (
  authorId: ObjectId | string,
  payload: IGuide,
  images: TImageFiles
) => {
  const { itemImages } = images;
  payload.images = itemImages.map((image) => image.path);

  const newPayload = {
    ...payload,
    author: authorId,
  };

  const result = await Blog.create(newPayload);

  return result;
};

const getAllGuideFromDB = async (query: Record<string, unknown>) => {
  const gardeningPostQuery = new QueryBuilder(
    Blog.find().populate('category'),
    query
  )
    .filter()
    .sort()
    // .paginate()
    .fields();

  const result = await gardeningPostQuery.modelQuery;

  return result;
};

// delete blog
const deleteBlogFromDB = async (blogId: string) => {
  // check is blog exists
  const post = await Blog.findOne({ _id: blogId, isDeleted: false });
  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, 'Gardening post does not exixts!');
  }
  const result = await Blog.updateOne({ _id: blogId }, { isDeleted: true });
  return result;
};

// const getAllGardeningPostsFromDB = async () => {
//   const result = await GardeningPost.find().populate('user');
//   // .populate('category');
//   return result;
// };

const getUserBlogsFromDB = async (userId: string) => {
  const result = await Blog.find({ author: userId, isDeleted: false }).populate(
    'category'
  );
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Blogs not exixts!');
  }
  // .populate('category');
  return result;
};

const getSingleGardeningPostFromDB = async (postId: string) => {
  console.log({ postId });
  const result = await GardeningPost.findById(postId);
  // .populate('user')
  // // .populate('category');
  // .populate('comments');
  return result;
};

const updateBlogIntoDB = async (
  payload: Partial<IGuide>,
  images: TImageFiles
) => {
  const postId = (payload as any).blogId;
  // check si post exists
  const post = await Blog.findOne({ _id: postId, isDeleted: false });
  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, 'Blog does not exixts!');
  }
  const { itemImages } = images;
  if (itemImages?.length > 0) {
    payload.images = itemImages.map((image) => image.path);
  }
  const result = await Blog.findByIdAndUpdate(postId, payload, {
    new: true,
  });

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

export const BlogService = {
  createGuideIntoDB,
  getAllGuideFromDB,
  deleteBlogFromDB,
  getUserBlogsFromDB,
  updateBlogIntoDB,
  //   getSingleGardeningPostFromDB,
  //   getUserGardeningPostsFromDB,
  //   updateGardeningPostInDB,
  //   // deleteGardeningPostFromDB,
  //   updatePostLikeStatusIntoDB,
};
