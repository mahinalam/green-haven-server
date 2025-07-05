import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TImageFiles } from '../../interfaces/image.interface';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { GuideService } from './Blogs.service';

// get all posts
const getAllGuides = catchAsync(async (req, res) => {
  const item = await GuideService.getAllGuideFromDB(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Guide Posts retrieved successfully',
    data: item,
  });
});

const createGuide = catchAsync(async (req, res) => {
  if (!req.files) {
    throw new AppError(400, 'Please upload an image');
  }
  const { _id } = req.user;
  const item = await GuideService.createGuideIntoDB(
    _id,
    req.body,
    req.files as TImageFiles
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Guide Post created successfully',
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

// const deleteGardeningPost = catchAsync(async (req, res) => {
//   const { id } = req.params;
//   await GardeningPostServices.deleteGardeningPostFromDB(id);

//   sendResponse(res, {
//     success: true,
//     statusCode: httpStatus.OK,
//     message: 'Gardening Post deleted successfully',
//     data: null,
//   });
// });

export const GuideController = {
  createGuide,
  getAllGuides,
  //   getAllItems,
  //   getItem,
  //   updateItem,
  // deleteGardeningPost,
};
