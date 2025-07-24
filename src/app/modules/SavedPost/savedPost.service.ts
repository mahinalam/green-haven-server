import httpStatus from "http-status";
import { QueryBuilder } from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";

// import GardeningPost from './GardeningPost.model';
import { ISavedPost } from "./savedPost.interface";
import SavedPost from "./savedPost.model";
import GardeningPost from "../GardeningPost/GardeningPost.model";

const createSavedPostIntoDB = async (userId: string, payload: ISavedPost) => {
  // check is post exists
  const post = await GardeningPost.findById(payload.post);
  console.log({ post });

  // if not throw exception
  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, "Post not found.");
  }

  // check is post is already deleted
  if (post.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "post already deleted!");
  }
  // chcek is sdaved post exists
  const isSavedPostExists = await SavedPost.findOne({
    user: userId,
    post: payload.post,
  });
  console.log({ isSavedPostExists });
  if (isSavedPostExists) {
    throw new AppError(409, "Saved post already exists!");
  }

  const updatedData = {
    ...payload,
    user: userId,
  };
  const result = await SavedPost.create(updatedData);

  return result;
};

const getAllUserSavedPostsFromDB = async (query: Record<string, unknown>) => {
  const userSavedPostQuery = new QueryBuilder(
    SavedPost.find()
      .populate({
        path: "user",
        select: "_id name email mobileNumber role profilePhoto createdAt",
      })
      .populate({
        path: "post",
        select: "_id title content images isPremium createdAt status",
      }),
    query
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await userSavedPostQuery.execWithMeta();

  return result;
};

// delete wishlist item
const deleteSavedPostFromDB = async (wishlistId: string) => {
  // check is wishlist item exists
  const post = await SavedPost.findOne({
    _id: wishlistId,
    isDeleted: false,
  }).select("_id");
  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, "Wishlist item does not exixts!");
  }
  const result = await SavedPost.updateOne(
    { _id: wishlistId },
    { isDeleted: true }
  );
  return result;
};

export const SavedPostServices = {
  createSavedPostIntoDB,
  getAllUserSavedPostsFromDB,
  deleteSavedPostFromDB,
  //   getSingleGardeningPostFromDB,
  //   getUserGardeningPostsFromDB,
  //   updateGardeningPostInDB,
  // deleteItemFromDB,
};
