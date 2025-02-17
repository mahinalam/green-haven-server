import express from 'express';
import { UserControllers } from './user.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from './user.constant';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidation } from './user.validation';
import { multerUpload } from '../../config/multer.config';
import { parseBody } from '../../middlewares/bodyParser';

const router = express.Router();

export const UserRoutes = router;

router.post(
  '/create-user',
  auth(USER_ROLE.ADMIN),
  validateRequest(UserValidation.createUserValidationSchema),
  UserControllers.userRegister
);
router.post(
  '/check-follower',
  // auth(USER_ROLE.ADMIN),

  UserControllers.checkFollower
);
router.get('/', UserControllers.getAllUsers);
router.get('/:id', UserControllers.getSingleUser);
router.put('/follow-users', UserControllers.followAndFollowingUser);
router.put('/unfollow-users', UserControllers.unFollowUser);
router.post;
router.delete('/:id', UserControllers.deleteUser);
