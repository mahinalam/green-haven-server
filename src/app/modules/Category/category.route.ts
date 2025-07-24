import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../User/user.constant";
import { CategoryValidationSchema } from "./category.validation";
import { CategoryControllers } from "./category.controller";

const router = express.Router();

router.get(
  "/",
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  CategoryControllers.getAllCategories
);
router.post(
  "/",
  auth(USER_ROLE.ADMIN),
  validateRequest(CategoryValidationSchema.createCategoryValidationSchema),
  CategoryControllers.createCategory
);

router.put(
  "/:id",
  auth(USER_ROLE.ADMIN),
  validateRequest(CategoryValidationSchema.updateCategoryValidationSchema),
  CategoryControllers.updateCategory
);

router.delete(
  "/:id",
  auth(USER_ROLE.ADMIN),
  CategoryControllers.deleteCategory
);

export const CategoryRoutes = router;
