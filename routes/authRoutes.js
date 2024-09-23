import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  verifyEmail,
  resetPassword,
  forgotPassword,
} from "../controllers/authController.js";
import { authUserMiddleware } from "../middlewares/index.js";

const authRouter = Router();

authRouter.route("/register").post(registerUser);
authRouter.route("/login").post(loginUser);
authRouter.route("/logout").delete(authUserMiddleware,logoutUser);
authRouter.route("/verify-email/").post(verifyEmail);
authRouter.route("/forgot-password").post(forgotPassword);
authRouter.route("/reset-password").post(resetPassword);

export default authRouter;
