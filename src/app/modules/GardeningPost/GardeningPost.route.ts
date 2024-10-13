import express from 'express';
import { multerUpload } from '../../config/multer.config';
import { parseBody } from '../../middlewares/bodyParser';
import validateImageFileRequest from '../../middlewares/validateImageFileRequest';
import validateRequest from '../../middlewares/validateRequest';
import { ImageFilesArrayZodSchema } from '../../zod/image.validation';

import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';
import { GardeningPostControllers } from './GardeningPost.controller';

// import { GardeningPostValidationSchema } from './GardeningPost.validation';
// import { GardeningPostControllers } from '../SavedPost/savedPost.controller';

const router = express.Router();

router.post(
  '/',
  auth(USER_ROLE.USER),
  multerUpload.fields([{ name: 'itemImages' }]),
  validateImageFileRequest(ImageFilesArrayZodSchema),
  parseBody,
  //   validateRequest(
  //     GardeningPostValidationSchema.createGardeningPostValidationSchema
  //   ),
  GardeningPostControllers.createGardeningPost
);

router.get('/', GardeningPostControllers.getAllGardeningPosts);
// router.get(
//   '/get-user-posts/:id',
//   GardeningPostControllers.getUserGardeningPosts
// );

// router.get('/:id', GardeningPostControllers.getSingleGardeningPost);

// router.put(
//   '/:id',
//   //   auth(USER_ROLE.USER),
//   //   validateRequest(ItemValidation.updateItemValidationSchema),
//   GardeningPostControllers.updateGardeningPost
// );

router.patch(
  '/',
  //   auth(USER_ROLE.USER),
  //   validateRequest(ItemValidation.updateItemValidationSchema),
  GardeningPostControllers.updateLikeStatus
);

// router.delete(
//   '/:id',
//   //  auth(USER_ROLE.USER),
//   GardeningPostControllers.deleteGardeningPost
// );

export const GardeningPostRoutes = router;
