import express from 'express';
import { AuthRoutes } from '../modules/Auth/auth.route';
import { UserRoutes } from '../modules/User/user.route';
import { ProfileRoutes } from '../modules/Profile/profile.route';
import { GardeningPostRoutes } from '../modules/GardeningPost/GardeningPost.route';
import { CommentRoutes } from '../modules/Comment/Comment.route';
import { CategoryRoutes } from '../modules/Category/category.route';
import { SavedPostRoutes } from '../modules/SavedPost/savedPost.route';
// import { PaymentRoutes } from '../modules/Payment/payment.route';
import { paymentRoutes } from '../modules/Payment/payment.route';
import { VerifyProfileRoutes } from '../modules/VerifyProfile/verifyProfile.route';
// import { VerifyProfileRoutes } from '../modules/VerifyProfile/verifyProfile.route';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },

  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/gardening-posts',
    route: GardeningPostRoutes,
  },
  {
    path: '/saved-post',
    route: SavedPostRoutes,
  },
  {
    path: '/comments',
    route: CommentRoutes,
  },
  {
    path: '/category',
    route: CategoryRoutes,
  },
  {
    path: '/profile',
    route: ProfileRoutes,
  },
  {
    path: '/verify-profile',
    route: VerifyProfileRoutes,
  },
  {
    path: '/payment',
    route: paymentRoutes,
  },
  {
    path: '/profile',
    route: ProfileRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
