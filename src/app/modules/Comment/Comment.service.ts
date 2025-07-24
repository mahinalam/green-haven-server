import httpStatus from "http-status";
import { QueryBuilder } from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import GardeningPost from "../GardeningPost/GardeningPost.model";
import { IComment } from "./Comment.interface";
import Comment from "./Comment.model";

const createCommentIntoDB = async (
  userId: string,
  payload: Record<string, unknown>
) => {
  // check is post exists
  const post = await GardeningPost.findOne({
    _id: payload.post,
    isDeleted: false,
  });
  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, "Gardening post does not exixts!");
  }

  const newPayload = {
    ...payload,
    user: userId,
  };

  const result = await Comment.create(newPayload);
  return result;
};

const getAllCommentsFromDB = async (query: Record<string, unknown>) => {
  const commentQuery = new QueryBuilder(
    Comment.find()
      .populate({
        path: "user",
        select: "_id name email role mobileNumber profilePhoto",
      })
      .populate({
        path: "post",
        select: "_id content title images status, isPremium",
      })
      .select("_id content"),
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

// delete commment
const deleteCommentFromDB = async (commentId: string) => {
  // check is comment exists
  const comment = await Comment.findById(commentId).select("_id");
  if (!comment) {
    throw new AppError(httpStatus.NOT_FOUND, "Comment does not exixts!");
  }
  if (comment.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, "Comment already deleted!");
  }

  await Comment.findByIdAndUpdate(commentId, {
    isDeleted: true,
  });
  return null;
};

export const CommentServices = {
  createCommentIntoDB,
  getAllCommentsFromDB,
  updateCommentIntoDB,
  deleteCommentFromDB,
};
