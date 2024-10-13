import express from 'express';
import validateRequest from '../../middlewares/validateRequest';

import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';
import { CategoryValidationSchema } from './category.validation';
import { CategoryControllers } from './category.controller';

const router = express.Router();

router.post(
  '/',
  //   auth(USER_ROLE.USER),
  validateRequest(CategoryValidationSchema.createCategoryValidationSchema),
  CategoryControllers.createCategory
);

router.get('/', CategoryControllers.getAllCategories);

// router.get('/:id', ItemControllers.getItem);

router.put(
  '/:id',
  //   auth(USER_ROLE.USER),
  validateRequest(CategoryValidationSchema.updateCategoryValidationSchema),
  CategoryControllers.updateCategory
);

router.delete(
  '/:id',
  // auth(USER_ROLE.USER),
  CategoryControllers.deleteCategory
);

export const CategoryRoutes = router;
