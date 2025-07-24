import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../User/user.constant";
import { ContactController } from "./contact.controller";

const router = express.Router();

router.post(
  "/",
  auth(USER_ROLE.USER),
  //   validateRequest(CommentValidationSchema.createCommentValidationSchema),
  ContactController.createContact
);

export const ContactRoute = router;
