import express from "express";
import { multerUpload } from "../../config/multer.config";
import { parseBody } from "../../middlewares/bodyParser";
import validateImageFileRequest from "../../middlewares/validateImageFileRequest";
import { ImageFilesArrayZodSchema } from "../../zod/image.validation";

import auth from "../../middlewares/auth";
import { USER_ROLE } from "../User/user.constant";
import { BlogController } from "./Blogs.controller";

const router = express.Router();
router.get(
  "/",
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  BlogController.getAllGuides
);
router.get(
  "/:id",
  auth(USER_ROLE.USER, USER_ROLE.ADMIN),
  BlogController.getSingleBlog
);
router.post(
  "/",
  auth(USER_ROLE.USER),
  multerUpload.fields([{ name: "itemImages" }]),
  validateImageFileRequest(ImageFilesArrayZodSchema),
  parseBody,
  BlogController.createGuide
);

router.put(
  "/",
  multerUpload.fields([{ name: "itemImages" }]),
  parseBody,
  auth(USER_ROLE.USER),
  BlogController.updateBlog
);

router.delete(
  "/:id",
  auth(USER_ROLE.USER, USER_ROLE.ADMIN),
  BlogController.deleteBlog
);

export const BlogRoute = router;
