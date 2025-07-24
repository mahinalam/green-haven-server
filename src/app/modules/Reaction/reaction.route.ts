import express from "express";
import { ReactionController } from "./reaction.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../User/user.constant";

const router = express.Router();
router.get(
  "/:postId",
  auth(USER_ROLE.USER, USER_ROLE.ADMIN),
  ReactionController.getPostReaction
);
router.post("/", auth(USER_ROLE.USER), ReactionController.createReaction);

export const ReactionRoute = router;
