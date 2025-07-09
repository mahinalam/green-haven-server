import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TImageFiles } from '../../interfaces/image.interface';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CommentServices } from './Comment.service';

const createComment = catchAsync(async (req, res) => {
  const { _id } = req.user;
  const comment = await CommentServices.createCommentIntoDB(_id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Comment created successfully',
    data: comment,
  });
});

const getAllComments = catchAsync(async (req, res) => {
  const comments = await CommentServices.getAllCommentsFromDB(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Comments retrieved successfully',
    data: comments,
  });
});

const updateComment = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updatedItem = await CommentServices.updateCommentIntoDB(id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Comment updated successfully',
    data: updatedItem,
  });
});

const deleteComment = catchAsync(async (req, res) => {
  const { id } = req.params;
  await CommentServices.deleteCommentFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Comment deleted successfully',
    data: null,
  });
});

export const CommentControllers = {
  createComment,
  getAllComments,
  updateComment,
  //   getItem,
  deleteComment,
};
