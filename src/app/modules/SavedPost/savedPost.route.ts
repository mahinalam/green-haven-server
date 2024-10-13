import express from 'express';
import { multerUpload } from '../../config/multer.config';
import { parseBody } from '../../middlewares/bodyParser';
import validateImageFileRequest from '../../middlewares/validateImageFileRequest';
import validateRequest from '../../middlewares/validateRequest';
import { ImageFilesArrayZodSchema } from '../../zod/image.validation';

import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';
import { SavedPostControllers } from './savedPost.controller';

const router = express.Router();

router.post(
  '/',
  //   auth(USER_ROLE.USER),

  //   validateRequest(
  //     GardeningPostValidationSchema.createGardeningPostValidationSchema
  //   ),
  SavedPostControllers.createSavedPost
);

router.get('/', SavedPostControllers.getAllUserSavedPost);
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

// router.delete('/:id', auth(USER_ROLE.USER), ItemControllers.deleteItem);

export const SavedPostRoutes = router;
