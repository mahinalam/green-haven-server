import httpStatus from 'http-status';
import { QueryBuilder } from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';

// import GardeningPost from './GardeningPost.model';
import { ISavedPost } from './savedPost.interface';
import SavedPost from './savedPost.model';

const createSavedPostIntoDB = async (payload: ISavedPost) => {
  const isSavedPostExists = await SavedPost.findById(payload.post);
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

// const deleteItemFromDB = async (itemId: string) => {
//   const result = await Item.findByIdAndDelete(itemId);
//   // const deletedItemId = result?._id;
//   // if (deletedItemId) {
//   //   await deleteDocumentFromIndex('items', deletedItemId.toString());
//   // }
//   return result;
// };

export const SavedPostServices = {
  createSavedPostIntoDB,
  getAllUserSavedPostsFromDB,
  //   getSingleGardeningPostFromDB,
  //   getUserGardeningPostsFromDB,
  //   updateGardeningPostInDB,
  // deleteItemFromDB,
};
