import express from "express";
import { UserControllers } from "./user.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "./user.constant";
import validateRequest from "../../middlewares/validateRequest";
import { UserValidation } from "./user.validation";
import { multerUpload } from "../../config/multer.config";
import { parseBody } from "../../middlewares/bodyParser";

const router = express.Router();

export const UserRoutes = router;
router.get("/", auth(USER_ROLE.ADMIN), UserControllers.getAllUsers);
router.get(
  "/single-user/:id",
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  UserControllers.getSingleUser
);
router.get(
  "/user-stats",
  auth(USER_ROLE.USER, USER_ROLE.ADMIN),
  UserControllers.userStats
);
router.post(
  "/create-user",
  auth(USER_ROLE.ADMIN),
  validateRequest(UserValidation.createUserValidationSchema),
  UserControllers.userRegister
);
router.post(
  "/check-follower",
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),

  UserControllers.checkFollower
);

router.post(
  "/top-gardeners",
  auth(USER_ROLE.ADMIN),
  UserControllers.createTopGardener
);

router.put(
  "/profile",
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  multerUpload.single("profilePhoto"),
  parseBody,
  UserControllers.updateMyProfile
);
router.delete(
  "/top-gardeners/:id",
  auth(USER_ROLE.ADMIN),
  UserControllers.deleteTopGardener
);

router.delete("/:id", UserControllers.deleteUser);
