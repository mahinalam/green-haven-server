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
