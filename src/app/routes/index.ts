import express from "express";
import { AuthRoutes } from "../modules/Auth/auth.route";
import { UserRoutes } from "../modules/User/user.route";
import { GardeningPostRoutes } from "../modules/GardeningPost/GardeningPost.route";
import { CommentRoutes } from "../modules/Comment/Comment.route";
import { CategoryRoutes } from "../modules/Category/category.route";
import { SavedPostRoutes } from "../modules/SavedPost/savedPost.route";
// import { PaymentRoutes } from '../modules/Payment/payment.route';
import { paymentRoutes } from "../modules/Payment/payment.route";
import { VerifyProfileRoutes } from "../modules/VerifyProfile/verifyProfile.route";
import { ReactionRoute } from "../modules/Reaction/reaction.route";
import { BlogRoute } from "../modules/Blogs/Blogs.route";
import { PostShareRoute } from "../modules/PostShare/postShare.route";
import { FollowRoute } from "../modules/Follower/follower.route";
import { ContactRoute } from "../modules/Contact/contact.route";
// import { VerifyProfileRoutes } from '../modules/VerifyProfile/verifyProfile.route';

const router = express.Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },

  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/gardening-posts",
    route: GardeningPostRoutes,
  },
  {
    path: "/wishlist",
    route: SavedPostRoutes,
  },
  {
    path: "/comments",
    route: CommentRoutes,
  },
  {
    path: "/category",
    route: CategoryRoutes,
  },
  {
    path: "/verify-profile",
    route: VerifyProfileRoutes,
  },
  {
    path: "/payment",
    route: paymentRoutes,
  },
  {
    path: "/react",
    route: ReactionRoute,
  },
  {
    path: "/blogs",
    route: BlogRoute,
  },
  {
    path: "/share",
    route: PostShareRoute,
  },
  {
    path: "/follow",
    route: FollowRoute,
  },
  {
    path: "/contact",
    route: ContactRoute,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
