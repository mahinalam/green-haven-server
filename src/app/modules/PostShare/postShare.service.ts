/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { User } from "../User/user.model";
import { PostShare } from "./postShare.model";
import GardeningPost from "../GardeningPost/GardeningPost.model";
import { IShare } from "./postShare.interface";

const createSharePost = async (sharedById: string, payload: IShare) => {
  const post = await GardeningPost.findOne({ _id: payload.post });
  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, "Post not found");
  }

  const user = await User.findOne({ _id: payload.user });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const newPayload = { ...payload, sharedBy: sharedById };

  const result = await PostShare.create(newPayload);

  return result;
};

const getSharePost = async () => {
  const result = await PostShare.find()
    .populate({
      path: "post",
      select: "_id images createdAt title content",
    })
    .populate({
      path: "user",
      select: "_id name profilePhoto email role mobileNumber",
    });

  return result;
};

export const PostShareService = {
  createSharePost,
  getSharePost,
};
