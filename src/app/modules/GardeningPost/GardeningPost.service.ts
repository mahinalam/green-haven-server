/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import { QueryBuilder } from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import { TImageFiles } from "../../interfaces/image.interface";
import { IGardeningPost } from "./GardeningPost.interface";
import GardeningPost from "./GardeningPost.model";
import { User } from "../User/user.model";
import { postSearchableFields } from "./GardeningPost.constant";

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
    GardeningPost.find()
      .populate({
        path: "user",
        select: "_id name email mobileNumber profilePhoto role isVerified",
      })
      .populate({ path: "category", select: "_id name" }),
    query
  )
    .filter()
    .sort()
    .search(postSearchableFields)
    .fields()
    .paginate();
  const result = await gardeningPostQuery.execWithMeta();

  return result;
};

const getUserGardeningPostsFromDB = async (userId: string) => {
  const result = await GardeningPost.find({ user: userId }).populate("user");
  return result;
};

const getSingleGardeningPostFromDB = async (postId: string) => {
  const result = await GardeningPost.findById(postId).populate("user");
  return result;
};

const updateGardeningPostInDB = async (
  payload: Partial<IGardeningPost>,
  images: TImageFiles
) => {
  const postId = (payload as any).postId;
  // check si post exists
  const post = await GardeningPost.findOne({ _id: postId, isDeleted: false });
  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, "Gardening post does not exixts!");
  }
  const { itemImages } = images;
  if (itemImages.length > 0) {
    payload.images = itemImages.map((image) => image.path);
  }
  const result = await GardeningPost.findByIdAndUpdate(postId, payload, {
    new: true,
  });

  return result;
};

// delete post
const deleteGardeningPost = async (postId: string) => {
  // check is gardening post exists
  const post = await GardeningPost.findOne({ _id: postId });
  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, "Gardening post does not exixts!");
  }
  const result = await GardeningPost.updateOne(
    { _id: postId },
    { isDeleted: true }
  );
  return result;
};

const getPostsByTopGardenersFromDB = async () => {
  // Step 1: Get top gardeners
  // const topGardeners = await User.find({ isTopGardener: true }).select("_id");
  // console.log({ topGardeners });

  // const topGardenerIds = topGardeners.map((user) => user._id);
  // console.log({ topGardenerIds });

  // // Step 2: Get posts from those top gardeners
  // const posts = await GardeningPost.find({
  //   user: { $in: topGardenerIds },
  // })
  //   .populate({ path: "user", select: "_id name email profilePhoto " })
  //   .select("_id ");

  // return posts;
  const topGardeners = await User.find({ isTopGardener: true }).select("_id");
  console.log({ topGardeners });
  const topGardenerIds = topGardeners.map((user) => user._id);

  const posts = await GardeningPost.aggregate([
    {
      $match: {
        user: { $in: topGardenerIds },
      },
    },
    {
      $sort: { createdAt: -1 }, // optional: get latest post
    },
    {
      $group: {
        _id: "$user", // group by user
        post: { $first: "$$ROOT" },
      },
    },
    {
      $replaceRoot: { newRoot: "$post" },
    },
  ]);

  // Then populate the users
  await GardeningPost.populate(posts, {
    path: "user",
    select: "_id name email profilePhoto",
  });

  return posts;
};

const updatePostLikeStatusIntoDB = async (
  postId: string,
  userId: string,
  status: string
) => {
  const isAlredayVoted = await GardeningPost.findById(postId);
  if (!isAlredayVoted) {
    throw new AppError(httpStatus.NOT_FOUND, "Gardening post does not exixts!");
  }

  const isPostAlredayDeleted = isAlredayVoted.isDeleted;
  if (isPostAlredayDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, "Gardening post alreday deleted!");
  }
  const isUserExists = await User.findById(userId);

  if (!isUserExists) {
    throw new AppError(httpStatus.NOT_FOUND, "User does not exists!");
  }

  const isDeletedUser = isUserExists.isDeleted;
  if (isDeletedUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User alreday deleted!");
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
    throw new AppError(httpStatus.NOT_FOUND, "User vote alreday exists!");
  }

  const updateField =
    status === "like" ? { upVotes: userId } : { downVotes: userId };

  const result = await GardeningPost.findByIdAndUpdate(
    postId,
    {
      $addToSet: updateField, // Conditionally update upVotes or downVotes
    },
    { new: true }
  );

  return result;
};

export const GardeningPostServices = {
  createGardeningPostIntoDB,
  getAllGardeningPostsFromDB,
  getSingleGardeningPostFromDB,
  getUserGardeningPostsFromDB,
  updateGardeningPostInDB,
  deleteGardeningPost,
  updatePostLikeStatusIntoDB,
  getPostsByTopGardenersFromDB,
};
