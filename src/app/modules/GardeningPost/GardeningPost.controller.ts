import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TImageFiles } from '../../interfaces/image.interface';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { GardeningPostServices } from './GardeningPost.service';

// get all posts
const getAllGardeningPosts = catchAsync(async (req, res) => {
  const item = await GardeningPostServices.getAllGardeningPostsFromDB(
    req.query
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Gardening Posts retrieved successfully',
    data: item,
  });
});

// get single post
const getSingleGardeningPost = catchAsync(async (req, res) => {
  const { id } = req.params;
  const item = await GardeningPostServices.getSingleGardeningPostFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Gardening Post retrieved successfully',
    data: item,
  });
});

// create post
const createGardeningPost = catchAsync(async (req, res) => {
  if (!req.files) {
    throw new AppError(400, 'Please upload an image');
  }

  const item = await GardeningPostServices.createGardeningPostIntoDB(
    req.body,
    req.files as TImageFiles
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Gardening Post created successfully',
    data: item,
  });
});

// const getItem = catchAsync(async (req, res) => {
//   const itemId = req.params.id;
//   const item = await ItemServices.getItemFromDB(itemId);

//   sendResponse(res, {
//     success: true,
//     statusCode: httpStatus.OK,
//     message: 'Item retrieved successfully',
//     data: item,
//   });
// });
// update like status
const updateLikeStatus = catchAsync(async (req, res) => {
  const { postId, userId, status } = req.body;
  const updatedItem = await GardeningPostServices.updatePostLikeStatusIntoDB(
    postId,
    userId,
    status
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Vote addeded successfully',
    data: updatedItem,
  });
});

// delete post
const deleteGardeningPost = catchAsync(async (req, res) => {
  const { id } = req.params;
  await GardeningPostServices.deleteGardeningPost(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Gardening Post deleted successfully',
    data: null,
  });
});

// update post
// get single post
const updateGardeningPost = catchAsync(async (req, res) => {
  const item = await GardeningPostServices.updateGardeningPostInDB(
    req.body,
    req.files as TImageFiles
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Gardening Post uppdated successfully',
    data: item,
  });
});

export const GardeningPostControllers = {
  createGardeningPost,
  getAllGardeningPosts,
  updateLikeStatus,
  getSingleGardeningPost,
  updateGardeningPost,
  //   getAllItems,
  //   getItem,
  //   updateItem,
  deleteGardeningPost,
};
