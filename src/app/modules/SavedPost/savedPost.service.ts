import httpStatus from 'http-status';
import { QueryBuilder } from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';

// import GardeningPost from './GardeningPost.model';
import { ISavedPost } from './savedPost.interface';
import SavedPost from './savedPost.model';
import GardeningPost from '../GardeningPost/GardeningPost.model';

const createSavedPostIntoDB = async (userId: string, payload: ISavedPost) => {
  // check is post exists
  const post = await GardeningPost.findById(payload.post);

  // if not throw exception
  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, 'Saved post already exists!');
  }

  // check is post is already deleted
  if (post.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'post already deleted!');
  }
  // chcek is sdaved post exists
  const isSavedPostExists = await SavedPost.findOne({
    user: userId,
    post: payload.post,
  });
  if (isSavedPostExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Saved post already exists!');
  }
  const result = await SavedPost.create(payload);

  return result;
};

const getAllUserSavedPostsFromDB = async (query: Record<string, unknown>) => {
  const userSavedPostQuery = new QueryBuilder(
    SavedPost.find().populate('user').populate('post'),
    query
  )
    .filter()
    .sort()
    // .paginate()
    .fields();

  const result = await userSavedPostQuery.modelQuery;

  return result;
};

// const getAllGardeningPostsFromDB = async () => {
//   const result = await GardeningPost.find().populate('user');
//   // .populate('category');
//   return result;
// };

// const getUserGardeningPostsFromDB = async (userId: string) => {
//   const result = await GardeningPost.find({ user: userId }).populate('user');
//   // .populate('category');
//   return result;
// };

// const getSingleGardeningPostFromDB = async (postId: string) => {
//   const result = await GardeningPost.findById(postId)
//     .populate('user')
//     // .populate('category');
//     .populate('comments');
//   return result;
// };

// const updateGardeningPostInDB = async (
//   postId: string,
//   payload: Partial<IGardeningPost>
// ) => {
//   const result = await GardeningPost.findByIdAndUpdate(postId, payload, {
//     new: true,
//   });
// if (result) {
//   await addDocumentToIndex(result, 'items');
// } else {
//   throw new Error(`Item with ID ${itemId} not found.`);
// }
//   return result;
// };

// delete wishlist item
const deleteSavedPostFromDB = async (wishlistId: string) => {
  console.log({ wishlistId });
  // check is wishlist item exists
  const post = await SavedPost.findOne({
    _id: wishlistId,
    isDeleted: false,
  }).select('_id');
  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, 'Wishlist item does not exixts!');
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
