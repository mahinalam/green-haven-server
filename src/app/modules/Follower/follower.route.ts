import express from "express";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../User/user.constant";
import { FollowController } from "./follower.controller";

const router = express.Router();

router.get(
  "/followers/:id",
  auth(USER_ROLE.USER),
  FollowController.getFollowersAndFollowingUser
);
router.post("/follow-user", auth(USER_ROLE.USER), FollowController.followUser);
router.post(
  "/unfollow-user",
  auth(USER_ROLE.USER),
  FollowController.unFollowUser
);
router.post(
  "/remove-follower",
  auth(USER_ROLE.USER),
  FollowController.removeFollower
);

export const FollowRoute = router;
