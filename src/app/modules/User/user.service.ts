import httpStatus from "http-status";
import { QueryBuilder } from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import { USER_STATUS, UserSearchableFields } from "./user.constant";
// import { TUser } from './user.interface';
import { User } from "./user.model";
import { ObjectId } from "mongoose";
import GardeningPost from "../GardeningPost/GardeningPost.model";
import SavedPost from "../SavedPost/savedPost.model";
import Blog from "../Blogs/Blogs.model";
import { Follow } from "../Follower/follower.model";
import Category from "../Category/category.model";
import { Payment } from "../Payment/payment.model";
import { TUser } from "./user.interface";
import { JwtPayload } from "jsonwebtoken";
import { TImageFile } from "../../interfaces/image.interface";

const createUser = async (payload: TUser) => {
  const user = await User.create(payload);

  return user;
};

const checkFollower = async (
  followerId: ObjectId | string,
  followingId: ObjectId | string
) => {
  const isFollowerExists = await User.findById(followerId);
  if (!isFollowerExists) {
    throw new AppError(httpStatus.NOT_FOUND, "User does not exists!");
  }

  const isFollowingUserExists = await User.findById(followingId);
  if (!isFollowingUserExists) {
    throw new AppError(httpStatus.NOT_FOUND, "User does not exists!");
  }

  const isAlreadyFollowed = isFollowingUserExists.followers.some(
    (follower: ObjectId) => follower.toString() === followerId.toString()
  );
  return isAlreadyFollowed;
};

const getAllUsersFromDB = async (query: Record<string, unknown>) => {
  const users = new QueryBuilder<any>(
    User.find().select(
      "_id name profilePhoto mobileNumber email isVerified role isTopGardener"
    ),
    query
  )
    .fields()
    .paginate()
    .sort()
    .filter()
    .search(UserSearchableFields);

  const result = await users.execWithMeta();

  return result;
};

const getSingleUserFromDB = async (id: string) => {
  const user = await User.findById(id);
  if (!user) throw new AppError(httpStatus.NOT_FOUND, "User does not exists!");
  const result = await User.findById(id).select(
    "_id name role email profilePhoto mobileNumber isVerified"
  );
  return result;
};

const deleteUserFromDB = async (userId: string) => {
  await User.findByIdAndUpdate(userId, {
    isDeleted: true,
  });

  return null;
};

const getUserStatsFromDB = async (userId: string, role: "USER" | "ADMIN") => {
  if (role === "USER") {
    const totalPosts = await GardeningPost.countDocuments({
      user: userId,
      isDeleted: false,
    });

    const totalSavedPosts = await SavedPost.countDocuments({
      user: userId,
      isDeleted: false,
    });

    const totalBlogs = await Blog.countDocuments({
      author: userId,
      isDeleted: false,
    });

    const totalFollowers = await Follow.countDocuments({ following: userId });

    return {
      totalPosts,
      totalSavedPosts,
      totalBlogs,
      totalFollowers,
    };
  } else {
    const totalPosts = await GardeningPost.countDocuments({
      isDeleted: false,
    });

    const totalBlogs = await Blog.countDocuments({
      isDeleted: false,
    });

    const totalCategories = await Category.countDocuments({
      isDeleted: false,
    });

    const totalPayments = await Payment.countDocuments({ isDeleted: false });

    return {
      totalPosts,
      totalBlogs,
      totalCategories,
      totalPayments,
    };
  }
};

const updateMyProfile = async (
  id: string,
  data: Partial<any>,
  profilePhoto: TImageFile
) => {
  if (profilePhoto) {
    data.profilePhoto = profilePhoto.path;
  } else {
    delete data.profilePhoto;
  }

  return await User.findByIdAndUpdate(id, data, { new: true });
};

const createTopGardenerIntoDB = async (userId: string) => {
  // check if user exists
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(404, "User not found.");
  }

  // check if already a top gardener
  if (user.isTopGardener) {
    throw new AppError(400, "User is already a Top Gardener.");
  }

  // update the user to top gardener
  const result = await User.updateOne(
    { _id: userId },
    { $set: { isTopGardener: true } }
  );

  return result;
};
// delete top gardener
const deleteTopGardenerFromDB = async (userId: string) => {
  // check is wishlist item exists
  const user = await User.findById(userId).select("_id isTopGardener");
  if (!user) {
    throw new AppError(404, "User doesn't exists!");
  }
  if (!user.isTopGardener) {
    throw new AppError(404, "This user is not listed as a Top Gardener.");
  }
  const result = await User.updateOne(
    { _id: userId },
    { $set: { isTopGardener: false } }
  );
  return result;
};

export const UserServices = {
  createUser,
  getAllUsersFromDB,
  getSingleUserFromDB,
  checkFollower,
  deleteUserFromDB,
  getUserStatsFromDB,
  updateMyProfile,
  createTopGardenerIntoDB,
  deleteTopGardenerFromDB,
};
