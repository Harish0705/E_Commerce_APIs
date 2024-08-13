import { Router } from "express";
import {
  getAllUsers,
  getOneUser,
  getCurrentUser,
  updateUser,
  updateUserPassword,
} from "../controllers/userController.js";

import {
  authUserMiddleware,
  authorizePermission,
} from "../middlewares/index.js";

const usersRouter = Router();

usersRouter
  .route("/")
  .get([authUserMiddleware, authorizePermission("admin")], getAllUsers);

usersRouter.route("/currentuser").get(authUserMiddleware, getCurrentUser);

usersRouter.route("/updateuser").put(authUserMiddleware, updateUser);

usersRouter
  .route("/updatepassword")
  .put(authUserMiddleware, updateUserPassword);

// this route should be at last. if it is above the showuser, updateuser and updatepassword routes then express will hit this route throw error because it will expect an id
usersRouter
  .route("/:id")
  .get(authUserMiddleware, getOneUser);

export default usersRouter;
