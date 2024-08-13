import { Router } from "express";
import {
  createProduct,
  getAllProducts,
  getOneProduct,
  deleteProduct,
  updateProduct,
} from "../controllers/productController.js";

import {
  authUserMiddleware,
  authorizePermission,
} from "../middlewares/index.js";

const productsRouter = Router();

productsRouter
  .route("/")
  .get(getAllProducts)
  .post([authUserMiddleware, authorizePermission('admin')], createProduct);
productsRouter
  .route("/:id")
  .get(getOneProduct)
  .put([authUserMiddleware, authorizePermission('admin')], updateProduct)
  .delete([authUserMiddleware, authorizePermission('admin')], deleteProduct);

export default productsRouter;
