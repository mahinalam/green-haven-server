import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TImageFiles } from '../../interfaces/image.interface';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { SavedPostServices } from './savedPost.service';

const createSavedPost = catchAsync(async (req, res) => {
  const item = await SavedPostServices.createSavedPostIntoDB(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Post created successfully',
    data: item,
  });
});

const getAllUserSavedPost = catchAsync(async (req, res) => {
  console.log(req.query);
  const item = await SavedPostServices.getAllUserSavedPostsFromDB(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Saved posts retrieved successfully',
    data: item,
  });
});

// const getUserGardeningPosts = catchAsync(async (req, res) => {
//   const item = await GardeningPostServices.getUserGardeningPostsFromDB(
//     req.params.id
//   );

//   sendResponse(res, {
//     success: true,
//     statusCode: httpStatus.OK,
//     message: 'User Gardening posts retrieved successfully',
//     data: item,
//   });
// });

// const getSingleGardeningPost = catchAsync(async (req, res) => {
//   const itemId = req.params.id;
//   const item = await GardeningPostServices.getSingleGardeningPostFromDB(itemId);

//   sendResponse(res, {
//     success: true,
//     statusCode: httpStatus.OK,
//     message: 'Gardening post retrieved successfully',
//     data: item,
//   });
// });

// const updateGardeningPost = catchAsync(async (req, res) => {
//   const { id } = req.params;
//   const updatedItem = await GardeningPostServices.updateGardeningPostInDB(
//     id,
//     req.body
//   );

//   sendResponse(res, {
//     success: true,
//     statusCode: httpStatus.OK,
//     message: 'Gardening Post updated successfully',
//     data: updatedItem,
//   });
// });

// const deleteItem = catchAsync(async (req, res) => {
//   const { id } = req.params;
//   await ItemServices.deleteItemFromDB(id);

//   sendResponse(res, {
//     success: true,
//     statusCode: httpStatus.OK,
//     message: 'Item deleted successfully',
//     data: null,
//   });
// });

export const SavedPostControllers = {
  createSavedPost,
  getAllUserSavedPost,
  //   getAllGardeningPosts,
  //   getSingleGardeningPost,
  //   getUserGardeningPosts,
  //   updateGardeningPost,
  //   //   deleteItem,
};
