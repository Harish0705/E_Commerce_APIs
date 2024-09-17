import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import { Product } from "../models/productSchema.js";
import { Review } from "../models/reviewSchema.js";
import { validatePermission } from "../utils/validatePermission.js";

export const createReview = async (req, res) => {
  const { product: productId = "" } = req.body || {};
  const isValidProduct = await Product.findOne({ _id: productId });
  if (!isValidProduct) {
    throw new NotFoundError(`No product found with id : ${productId}`);
  }
  // check to block the user from submitting more than one review for the same product
  const hasSumbittedReview = await Review.findOne({
    product: productId,
    user: req.user.userId,
  });
  if (hasSumbittedReview) {
    throw new BadRequestError(
      "You have already submitted a review for this product"
    );
  }
  // Add user id to add the user object for the review
  req.body.user = req.user.userId;
  const review = await Review.create(req.body);
  res.status(StatusCodes.CREATED).json({ review });
};

export const getOneReview = async (req, res) => {
  const { id: reviewId = "" } = req.params || {};
  const review = await Review.findOne({ _id: reviewId });
  if (!review) {
    throw new NotFoundError(`No review found with id : ${reviewId}`);
  }
  res.status(StatusCodes.OK).json({ review });
};

export const getAllReviews = async (req, res) => {
  // const review = await Review.find({});
  // get the product name price and averageRating. Similarly, can populate user details to the review
  const review = await Review.find({}).populate({
    path: "product",
    select: "name company price averageRating",
  });
  res.status(StatusCodes.OK).json({ review });
};

export const updateReview = async (req, res) => {
  const { id: reviewId = "" } = req.params || {};
  const { rating = "", comment = "" } = req.body || {};

  const review = await Review.findOne({ _id: reviewId });
  if (!review) {
    throw new NotFoundError(`No review found with id : ${reviewId}`);
  }
  validatePermission(req.user, review.user);
  if (rating) review.rating = rating;
  if (comment) review.comment = comment;
  //
  await review.save();
  res.status(StatusCodes.OK).json({ review });
};
export const deleteReview = async (req, res) => {
  const { id: reviewId = "" } = req.params || {};

  const review = await Review.findOne({ _id: reviewId });
  if (!review) {
    throw new NotFoundError(`No review found with id : ${reviewId}`);
  }
  validatePermission(req.user, review.user);
  //
  await review.deleteOne();
  res.sendStatus(StatusCodes.NO_CONTENT);
};

export const getSingleProductReviews = async (req, res) => {
  const { id: productId = "" } = req.params;
  const review = await Review.find({ product: productId });
  if (!review) {
    throw new NotFoundError(`No review found for this product : ${productId}`);
  }
  res.status(StatusCodes.OK).json({ review });
};
