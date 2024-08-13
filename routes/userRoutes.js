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

// route to test the order of middleware 
usersRouter.route("/currentuser").get(authUserMiddleware, getCurrentUser);

// this route should be at last. if it is above the currentuser route then express will hit this route throw error because it will expect an id
usersRouter
  .route("/:id")
  .get(authUserMiddleware, getOneUser);

usersRouter.route("/:id/updateuser").put(authUserMiddleware, updateUser);

usersRouter
    .route("/:id/updatepassword")
    .put(authUserMiddleware, updateUserPassword);

export default usersRouter;
