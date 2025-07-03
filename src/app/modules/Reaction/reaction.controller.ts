import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ReactionService } from './reaction.service';

// get all reaction
const getPostReaction = catchAsync(async (req, res) => {
  const { postId } = req.params;
  const item = await ReactionService.getReactionCounts(postId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Reaction retrived successfully',
    data: item,
  });
});

// create reaction
const createReaction = catchAsync(async (req, res) => {
  const { _id } = req.user;
  const item = await ReactionService.createReaction(_id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Reaction created successfully',
    data: item,
  });
});

export const ReactionController = {
  createReaction,
  getPostReaction,
};
