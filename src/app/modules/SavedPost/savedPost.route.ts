import express from "express";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../User/user.constant";
import { SavedPostControllers } from "./savedPost.controller";

const router = express.Router();

router.get("/", auth(USER_ROLE.USER), SavedPostControllers.getAllUserSavedPost);

router.post("/", auth(USER_ROLE.USER), SavedPostControllers.createSavedPost);

router.delete(
  "/:id",
  auth(USER_ROLE.USER),
  SavedPostControllers.deleteSavedPost
);

export const SavedPostRoutes = router;
