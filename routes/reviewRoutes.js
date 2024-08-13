import { Router } from "express";
import {
  getAllReviews,
  getOneReview,
  createReview,
  updateReview,
  deleteReview,
} from "../controllers/reviewController.js";

import { authUserMiddleware } from "../middlewares/index.js";

const reviewsRouter = Router();

reviewsRouter
  .route("/")
  .get(getAllReviews)
  .post(authUserMiddleware, createReview);
reviewsRouter
  .route("/:id")
  .get(getOneReview)
  .put(authUserMiddleware, updateReview)
  .delete(authUserMiddleware, deleteReview);

export default reviewsRouter;
