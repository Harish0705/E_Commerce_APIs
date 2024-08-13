import { Router } from "express";

import {
  createOrder,
  getAllOrders,
  getOneOrder,
  getCurrentUserOrders,
  updateOrder,
} from "../controllers/orderController.js";

import {
  authUserMiddleware,
  authorizePermission,
} from "../middlewares/index.js";

const ordersRouter = Router();

ordersRouter
  .route("/")
  .get([authUserMiddleware, authorizePermission("admin")], getAllOrders)
  .post(authUserMiddleware, createOrder);

ordersRouter
  .route("/showmyorders")
  .get(authUserMiddleware, getCurrentUserOrders);

ordersRouter
  .route("/:id")
  .get(authUserMiddleware, getOneOrder)
  .put(authUserMiddleware, updateOrder);

export default ordersRouter;
