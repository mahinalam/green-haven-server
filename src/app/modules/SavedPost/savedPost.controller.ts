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

const deleteSavedPost = catchAsync(async (req, res) => {
  const { id } = req.params;
  await SavedPostServices.deleteSavedPostFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Saved post deleted successfully',
    data: null,
  });
});

export const SavedPostControllers = {
  createSavedPost,
  getAllUserSavedPost,
  deleteSavedPost,
};
