import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CategoryServices } from './category.service';

const createCategory = catchAsync(async (req, res) => {
  const category = await CategoryServices.createCategoryIntoDB(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Category created successfully',
    data: category,
  });
});

const getAllCategories = catchAsync(async (req, res) => {
  const categories = await CategoryServices.getAllCategoriesFromDB(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Categories retrieved successfully',
    data: categories,
  });
});

const updateCategory = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updatedItem = await CategoryServices.updateCategoryIntoDB(id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Category updated successfully',
    data: updatedItem,
  });
});

const deleteCategory = catchAsync(async (req, res) => {
  const { id } = req.params;
  await CategoryServices.deleteCategoryFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Category deleted successfully',
    data: null,
  });
});

export const CategoryControllers = {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
};
