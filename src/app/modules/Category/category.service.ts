import { QueryBuilder } from '../../builder/QueryBuilder';
import { ICategory } from './category.interface';

import Category from './category.model';

const createCategoryIntoDB = async (payload: ICategory) => {
  const result = await Category.create(payload);

  return result;
};

// const getAllGardeningPostsFromDB = async (query: Record<string, unknown>) => {
//   query = (await SearchItemByUserQueryMaker(query)) || query;

//   // Date range search
//   query = (await SearchItemByDateRangeQueryMaker(query)) || query;

//   const itemQuery = new QueryBuilder(
//     Item.find().populate('user').populate('category'),
//     query
//   )
//     .filter()
//     .search(ItemsSearchableFields)
//     .sort()
//     // .paginate()
//     .fields();

//   const result = await itemQuery.modelQuery;

//   return result;
// };

const getAllCategoriesFromDB = async () => {
  const result = await Category.find();
  return result;
};

// const getItemFromDB = async (itemId: string) => {
//   const result = await Item.findById(itemId)
//     .populate('user')
//     .populate('category');
//   return result;
// };

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
