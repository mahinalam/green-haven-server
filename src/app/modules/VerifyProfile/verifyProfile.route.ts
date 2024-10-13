import express from 'express';

import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';
// import { SavedPostControllers } from './savedPost.controller';
import { VerifyProfileControllers } from './verifyProfile.controller';

const router = express.Router();

router.post(
  '/',
  auth(USER_ROLE.USER),

  //   validateRequest(
  //     GardeningPostValidationSchema.createGardeningPostValidationSchema
  //   ),
  VerifyProfileControllers.verifyProfile
);

// router.get('/', SavedPostControllers.getAllUserSavedPost);
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

export const VerifyProfileRoutes = router;
