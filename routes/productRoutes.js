import { Router } from "express";
import {
  createProduct,
  getAllProducts,
  getOneProduct,
  deleteProduct,
  updateProduct,
} from "../controllers/productController.js";

import { authUserMiddleware } from "../middlewares/index.js";

const productsRouter = Router();

productsRouter
  .route("/")
  .get(getAllProducts)
  .post(authUserMiddleware, createProduct);
productsRouter
  .route("/:id")
  .get(getOneProduct)
  .put(authUserMiddleware, updateProduct)
  .delete(authUserMiddleware, deleteProduct);

export default productsRouter;
