import { QueryBuilder } from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { ICategory } from './category.interface';

import Category from './category.model';

const createCategoryIntoDB = async (payload: ICategory) => {
  // check is category exists
  const category = await Category.findOne({ name: payload.name });
  if (category) {
    throw new AppError(403, 'Category already exists!');
  }
  const result = await Category.create(payload);

  return result;
};

const getAllCategoriesFromDB = async (query: Record<string, unknown>) => {
  const categories = new QueryBuilder<any>(
    Category.find().select('_id name createdAt'),
    query
  )
    .filter()
    .sort()
    .fields()
    .paginate();
  const result = await categories.execWithMeta();
  return result;
};

const updateCategoryIntoDB = async (
  categoryId: string,
  payload: Partial<ICategory>
) => {
  const result = await Category.findByIdAndUpdate(categoryId, payload, {
    new: true,
  });
  return result;
};

const deleteCategoryFromDB = async (categoryId: string) => {
  const result = await Category.findByIdAndUpdate(categoryId, {
    isDeleted: true,
    new: true,
  });
  return result;
};

export const CategoryServices = {
  createCategoryIntoDB,
  getAllCategoriesFromDB,
  // getItemFromDB,
  updateCategoryIntoDB,
  deleteCategoryFromDB,
};
