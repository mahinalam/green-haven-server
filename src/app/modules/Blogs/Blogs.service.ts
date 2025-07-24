/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import { QueryBuilder } from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { TImageFiles } from '../../interfaces/image.interface';
import { IGuide } from './Blogs.interface';
import { ObjectId } from 'mongoose';
import Blog from './Blogs.model';

const createGuideIntoDB = async (
  authorId: ObjectId | string,
  payload: IGuide,
  images: TImageFiles
) => {
  const { itemImages } = images;
  payload.images = itemImages.map((image) => image.path);

  const newPayload = {
    ...payload,
    author: authorId,
  };

  const result = await Blog.create(newPayload);
  return result;
};

const getAllGuideFromDB = async (query: Record<string, unknown>) => {
  console.log({ query });
  const gardeningPostQuery = new QueryBuilder(
    Blog.find().populate({ path: 'category', select: '_id name' }).populate({
      path: 'author',
      select: '_id name email mobileNumber profilePhoto role',
    }),
    query
  )
    .filter()
    .sort()
    .fields()
    .paginate();

  const result = await gardeningPostQuery.execWithMeta();

  return result;
};

// delete blog
const deleteBlogFromDB = async (blogId: string) => {
  // check is blog exists
  const post = await Blog.findOne({ _id: blogId, isDeleted: false });
  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, 'Gardening post does not exixts!');
  }
  const result = await Blog.updateOne({ _id: blogId }, { isDeleted: true });
  return result;
};

const getSingleBlog = async (blogId: string) => {
  // check is blog exists
  const blog = await Blog.findById(blogId);
  if (!blog) {
    throw new AppError(httpStatus.NOT_FOUND, 'Blog does not exixts!');
  }
  if (blog.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'Blog already deleted!');
  }
  const result = await Blog.findOne({ _id: blogId, isDeleted: false }).populate(
    'author'
  );
  return result;
};

const updateBlogIntoDB = async (
  payload: Partial<IGuide>,
  images: TImageFiles
) => {
  const postId = (payload as any).blogId;
  // check si post exists
  const post = await Blog.findOne({ _id: postId, isDeleted: false });
  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, 'Blog does not exixts!');
  }
  const { itemImages } = images;
  if (itemImages?.length > 0) {
    payload.images = itemImages.map((image) => image.path);
  }
  const result = await Blog.findByIdAndUpdate(postId, payload, {
    new: true,
  });

  return result;
};

export const BlogService = {
  createGuideIntoDB,
  getAllGuideFromDB,
  deleteBlogFromDB,
  updateBlogIntoDB,
  getSingleBlog,
};
