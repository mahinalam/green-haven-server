import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest, {
  validateRequestCookies,
} from '../../middlewares/validateRequest';
import { USER_ROLE } from '../User/user.constant';
import { AuthControllers } from './auth.controller';
import { AuthValidation } from './auth.validation';
import { multerUpload } from '../../config/multer.config';
import { parseBody } from '../../middlewares/bodyParser';
import { ImageFilesArrayZodSchema } from '../../zod/image.validation';
import validateImageFileRequest from '../../middlewares/validateImageFileRequest';

const router = express.Router();

// router.post(
//   '/',
//   auth(USER_ROLE.USER),
//   multerUpload.fields([{ name: 'itemImages' }]),
//   validateImageFileRequest(ImageFilesArrayZodSchema),
//   parseBody,
//   //   validateRequest(
//   //     GardeningPostValidationSchema.createGardeningPostValidationSchema
//   //   ),
//   GardeningPostControllers.createGardeningPost
// // );

router.post(
  '/register',
  multerUpload.single('profileImage'),
  parseBody,
  validateRequest(AuthValidation.registerValidationSchema),
  AuthControllers.registerUser
);
router.post(
  '/login',
  validateRequest(AuthValidation.loginValidationSchema),
  AuthControllers.loginUser
);

router.post(
  '/change-password',
  auth(USER_ROLE.USER, USER_ROLE.ADMIN),
  validateRequest(AuthValidation.changePasswordValidationSchema),
  AuthControllers.changePassword
);

router.post(
  '/refresh-token',
  validateRequestCookies(AuthValidation.refreshTokenValidationSchema),
  AuthControllers.refreshToken
);

export const AuthRoutes = router;
