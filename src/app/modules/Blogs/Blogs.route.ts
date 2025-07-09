import express from 'express';
import { multerUpload } from '../../config/multer.config';
import { parseBody } from '../../middlewares/bodyParser';
import validateImageFileRequest from '../../middlewares/validateImageFileRequest';
import validateRequest from '../../middlewares/validateRequest';
import { ImageFilesArrayZodSchema } from '../../zod/image.validation';

import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';
import { BlogController } from './Blogs.controller';

// import { GardeningPostValidationSchema } from './GardeningPost.validation';
// import { GardeningPostControllers } from '../SavedPost/savedPost.controller';

const router = express.Router();
router.get('/', BlogController.getAllGuides);
router.get('/user-blogs', auth(USER_ROLE.USER), BlogController.getUsersBlogs);
// router.get('/:id', GardeningPostControllers.getSingleGardeningPost);
router.post(
  '/',
  auth(USER_ROLE.USER),
  multerUpload.fields([{ name: 'itemImages' }]),
  validateImageFileRequest(ImageFilesArrayZodSchema),
  parseBody,
  BlogController.createGuide
);

// router.get('/:id', GardeningPostControllers.getSingleGardeningPost);

router.put(
  '/',
  multerUpload.fields([{ name: 'itemImages' }]),
  parseBody,
  auth(USER_ROLE.USER),
  BlogController.updateBlog
);

// router.patch(
//   '/',
//   //   auth(USER_ROLE.USER),
//   //   validateRequest(ItemValidation.updateItemValidationSchema),
//   GardeningPostControllers.updateLikeStatus
// );

router.delete('/:id', auth(USER_ROLE.USER), BlogController.deleteBlog);

export const BlogRoute = router;
