/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { IReaction } from "./reaction.interface";
import Reaction from "./reaction.model";
import GardeningPost from "../GardeningPost/GardeningPost.model";
import { ObjectId, Types } from "mongoose";
import Comment from "../Comment/Comment.model";

// export const getReactionCounts = async (postId: ObjectId | string) => { adjust the import

// export const getReactionCounts = async (postId: Types.ObjectId | string) => {
//   const objectId = new Types.ObjectId(postId);

//   const commentsCount = await Comment.countDocuments({
//     post: postId,
//     isDeleted: false,
//   });
//   const result = await Reaction.aggregate([
//     {
//       $match: {
//         post: objectId,
//         isDeleted: false,
//       },
//     },
//     {
//       $lookup: {
//         from: 'users',
//         localField: 'user',
//         foreignField: '_id',
//         as: 'user',
//       },
//     },
//     {
//       $unwind: '$user',
//     },
//     {
//       $group: {
//         _id: '$type', // like or dislike
//         count: { $sum: 1 },
//         users: {
//           $push: {
//             _id: '$user._id',
//             name: '$user.name',
//             email: '$user.email',
//             avatar: '$user.avatar',
//           },
//         },
//         postId: { $first: '$post' }, // still grab post ID from one of the grouped docs
//       },
//     },
//   ]);

//   // Convert the result into a consistent object format
//   const counts: Record<string, any> = {
//     like: { count: 0, users: [], postId: objectId.toString() },
//     dislike: { count: 0, users: [], postId: objectId.toString() },
//     comments: { count: commentsCount },
//   };

//   result.forEach((r) => {
//     counts[r._id] = {
//       count: r.count,
//       users: r.users,
//       postId: r.postId?.toString() ?? objectId.toString(), // fallback if postId is missing
//     };
//   });

//   return counts;
// };
interface ReactionCounts {
  like: { count: number; users: any[] };
  dislike: { count: number; users: any[] };
  love: { count: number; users: any[] };
  comments: { count: number };
  currentUserReaction: "like" | "dislike" | "love" | null;
}

export const getReactionCounts = async (
  postId: Types.ObjectId | string,
  currentUserId?: Types.ObjectId | string
): Promise<ReactionCounts> => {
  const objectId = new Types.ObjectId(postId);

  // 1. Count comments
  const commentsCount = await Comment.countDocuments({
    post: objectId,
    isDeleted: false,
  });

  // 2. Aggregate reactions with user info
  const result = await Reaction.aggregate([
    {
      $match: {
        post: objectId,
        isDeleted: false,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    {
      $group: {
        _id: "$type",
        count: { $sum: 1 },
        users: {
          $push: {
            _id: "$user._id",
            name: "$user.name",
            email: "$user.email",
            avatar: "$user.avatar",
          },
        },
        postId: { $first: "$post" },
      },
    },
  ]);

  // 3. Check if current user reacted
  let currentUserReaction: "like" | "dislike" | null = null;
  if (currentUserId) {
    const userReaction = await Reaction.findOne({
      post: objectId,
      user: currentUserId,
      isDeleted: false,
    }).select("type");
    currentUserReaction = userReaction?.type || null;
  }

  // 4. Structure the counts
  const counts: ReactionCounts = {
    like: { count: 0, users: [] },
    dislike: { count: 0, users: [] },
    love: { count: 0, users: [] },
    comments: { count: commentsCount },
    currentUserReaction,
  };

  result.forEach((r) => {
    if ((counts as any)[r._id]) {
      (counts as any)[r._id] = {
        count: r.count,
        users: r.users,
      };
    } else {
      // Support additional reaction types dynamically if needed
      (counts as any)[r._id] = {
        count: r.count,
        users: r.users,
      };
    }
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
    throw new AppError(httpStatus.NOT_FOUND, "Post not exists!");
  }
  // check is reaction exists
  const reaction = await Reaction.findOne({
    post: payload.post,
    user: userId,
  });

  // if exists through error
  if (reaction) {
    throw new AppError(httpStatus.NOT_FOUND, "Reaction already given!");
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
