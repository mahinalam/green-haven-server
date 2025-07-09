import { Router } from 'express';
import { paymentControler } from './payment.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';
// import { paymentControler } from './payment.controller';

const router = Router();

router.get(
  '/get-all-payments',
  auth(USER_ROLE.ADMIN),
  paymentControler.getAllPayments
);
router.get(
  '/isVerified',
  auth(USER_ROLE.USER),
  paymentControler.isUserVerified
);
router.post('/confirmation', paymentControler.confirmationController);

export const paymentRoutes = router;
