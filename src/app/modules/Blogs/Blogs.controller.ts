import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TImageFiles } from '../../interfaces/image.interface';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { BlogService } from './Blogs.service';

// get all posts
const getAllGuides = catchAsync(async (req, res) => {
  const item = await BlogService.getAllGuideFromDB(req.query);

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
  const item = await BlogService.createGuideIntoDB(
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

// delete blog
const deleteBlog = catchAsync(async (req, res) => {
  const { id } = req.params;
  await BlogService.deleteBlogFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Blog deleted successfully',
    data: null,
  });
});

// get users blogs
const getUsersBlogs = catchAsync(async (req, res) => {
  const { _id } = req.user;
  const item = await BlogService.getUserBlogsFromDB(_id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Blogs retrieved successfully',
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

// update blog
const updateBlog = catchAsync(async (req, res) => {
  const item = await BlogService.updateBlogIntoDB(
    req.body,
    req.files as TImageFiles
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Blog uppdated successfully',
    data: item,
  });
});
export const BlogController = {
  createGuide,
  getAllGuides,
  deleteBlog,
  getUsersBlogs,
  updateBlog,
  //   getAllItems,
  //   getItem,
  //   updateItem,
  // deleteGardeningPost,
};
