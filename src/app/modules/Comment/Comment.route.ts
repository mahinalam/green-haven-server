import express from "express";
import validateRequest from "../../middlewares/validateRequest";

import auth from "../../middlewares/auth";
import { USER_ROLE } from "../User/user.constant";
import { CommentValidationSchema } from "./Comment.validation";
import { CommentControllers } from "./Comment.controller";

const router = express.Router();

router.get("/", auth(USER_ROLE.USER), CommentControllers.getAllComments);

router.post(
  "/",
  auth(USER_ROLE.USER),
  validateRequest(CommentValidationSchema.createCommentValidationSchema),
  CommentControllers.createComment
);

// router.get('/:id', ItemControllers.getItem);

router.put(
  "/:id",
  auth(USER_ROLE.USER),
  validateRequest(CommentValidationSchema.updateCommentValidationSchema),
  CommentControllers.updateComment
);

router.delete("/:id", auth(USER_ROLE.USER), CommentControllers.deleteComment);

export const CommentRoutes = router;
