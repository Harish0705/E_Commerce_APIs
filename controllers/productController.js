import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import { Product } from "../models/productSchema.js";

export const createProduct = async (req, res) => {
  const { body = {}, user = {} } = req || {};
  body.user = user.userId;
  const product = await Product.create(body);
  return res.status(StatusCodes.CREATED).json({ product });
};
export const getOneProduct = async (req, res) => {
  const { params: { id = "" } = "" } = req || {};

  // const product = await Product.findOne({ _id: id });
  // populate reviews using mongodb virtuals
  const product = await Product.findOne({ _id: id }).populate('reviews');

  if (!product) {
    throw new NotFoundError(`No product found with id : ${id}`);
  }

  return res.status(StatusCodes.OK).json({ product });
};
export const getAllProducts = async (req, res) => {
  const products = await Product.find({});
  return res.status(StatusCodes.OK).json({ products, nbHits: products.length });
};

export const updateProduct = async (req, res) => {
  const { params: { id = "" } = "", body = "" } = req || {};

  const product = await Product.findOneAndUpdate({ _id: id }, body, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    throw new NotFoundError(`No product found with id : ${id}`);
  }

  return res.status(StatusCodes.OK).json({ product });
};
export const deleteProduct = async (req, res) => {
  const { params: { id = "" } = "" } = req || {};

  const product = await Product.findOneAndDelete({ _id: id });

  if (!product) {
    throw new NotFoundError(`No product found with id : ${id}`);
  }

  return res.status(StatusCodes.NO_CONTENT);
};
