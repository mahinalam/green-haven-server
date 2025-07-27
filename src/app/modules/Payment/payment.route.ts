import { Router } from "express";
import { paymentControler } from "./payment.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../User/user.constant";

const router = Router();

router.get("/", auth(USER_ROLE.ADMIN), paymentControler.getAllPayments);
router.get(
  "/isVerified",
  auth(USER_ROLE.USER),
  paymentControler.isUserVerified
);
router.post(
  "/verify-profile",
  auth(USER_ROLE.USER),
  paymentControler.verifyProfile
);
router.post("/confirmation", paymentControler.confirmationController);
router.delete(
  "/:id",
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  paymentControler.deletePayment
);

export const paymentRoutes = router;

// env files for amar pay
// NODE_ENV="development"
// PORT=5000
// DB_URL="mongodb+srv://gardening-tips-and-platform:qIa6TGWIVwJfu9B2@cluster0.zzcfrzy.mongodb.net/gradening-tips?retryWrites=true&w=majority&appName=Cluster0"
// BCRYPT_SALT_ROUNDS=12
// JWT_ACCESS_SECRET="jdjhjdjjdhdj"
// JWT_ACCESS_EXPIRES_IN="10d"
// JWT_REFRESH_SECRET="hsghsgyhw"
// JWT_REFRESH_EXPIRES_IN="30d"
// ADMIN_EMAIL="admin@gmail.com"
// ADMIN_PASSWORD="123456"
// SENDER_EMAIL="mahinalam351@gmail.com"
// SENDER_APP_PASS="jqwr lwkk lugz geim"
// ADMIN_PROFILE_PHOTO="kjs"
// ADMIN_MOBILE_NUMBER="01234567891"
// CLOUDINARY_CLOUD_NAME="dhojavkdo"
// CLOUDINARY_API_KEY=665628654226293
// CLOUDINARY_API_SECRET="x7yRGGvCG5Z9QD0B3WA4dPxWxSA"
// STORE_ID="aamarpaytest"
// SIGNATURE_KEY="dbb74894e82415a2f7ff0ec3a97e4183"
// PAYMENT_URL="https://sandbox.aamarpay.com/jsonpost.php"
// PAYMENT_VERIFY_URL="https://sandbox.aamarpay.com/api/v1/trxcheck/request.php"
// PAYMENT_FAIL_URL="https://green-haven-server-three.vercel.app/api/v1/payment/confirmation"
// PAYMENT_CANCEL_URL="https://green-haven-client.vercel.app"
