import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  verifyEmail,
  resetPassword,
  forgotPassword
} from "../controllers/authController.js";

const authRouter = Router();

authRouter.route("/register").post(registerUser);
authRouter.route("/login").post(loginUser);
authRouter.route("/logout").post(logoutUser);
authRouter.post('/verify-email/', verifyEmail);
authRouter.post('/reset-password', resetPassword);
authRouter.post('/forgot-password', forgotPassword);

export default authRouter;
