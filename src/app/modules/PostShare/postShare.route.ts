import express from "express";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../User/user.constant";
import { PostShareController } from "./postShare.controller";

const router = express.Router();
router.get(
  "/",
  auth(USER_ROLE.USER, USER_ROLE.ADMIN),
  PostShareController.getSharePost
);
router.post("/", auth(USER_ROLE.USER), PostShareController.createPostShare);

export const PostShareRoute = router;
