import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import { Product } from "../models/productSchema.js";
import { Order } from "../models/orderSchema.js";
import { validatePermission } from "../utils/validatePermission.js";

const mockStripeAPI = async ({ amount, currency }) => {
  const client_secret = 'hdjshdkhakshdj';
  return { client_secret, amount };
};

export const createOrder = async (req, res) => {
  const { items: cartItems, tax, shippingFee } = req.body;
  if (!cartItems || cartItems.length < 1) {
    throw new BadRequestError('No cart items provided');
  }
  if (!tax || !shippingFee) {
    throw new BadRequestError(
      'Please provide tax and shipping fee'
    );
  }
  let orderItems = [];
  let subtotal = 0;
  for (const item of cartItems) {
    const dbProduct = await Product.findOne({ _id: item.product });
    if (!dbProduct) {
      throw new CustomError.NotFoundError(
        `No product found with id : ${item.product}`
      );
    }
    const { name, price, _id } = dbProduct;
    const singleOrderItem = {
      amount: item.amount,
      name,
      price,
      product: _id,
    };
    // add item to order
    orderItems = [...orderItems, singleOrderItem];
    // calculate subtotal
    subtotal += item.amount * price;
  }
  // calculate total
  const total = tax + shippingFee + subtotal;
  // get client secret
  const paymentIntent = await mockStripeAPI({
    amount: total,
    currency: 'usd',
  });

  const order = await Order.create({
    orderItems,
    total,
    subtotal,
    tax,
    shippingFee,
    clientSecret: paymentIntent.client_secret,
    user: req.user.userId,
  });

  res
    .status(StatusCodes.CREATED)
    .json({ order, clientSecret: order.clientSecret });
};

export const getOneOrder = async (req, res) => {
  const { id: orderId } = req.params;
  const order = await Order.findOne({ _id: orderId });
  if (!order) {
    throw new NotFoundError(`No order with id : ${orderId}`);
  }
  // validate permission so that other user can't access the order 
  validatePermission(req.user, order.user);
  res.status(StatusCodes.OK).json({ order });
};

export const getAllOrders = async (req, res) => {
  const orders = await Order.find({});
  res.status(StatusCodes.OK).json({ orders, count: orders.length });
};

export const getCurrentUserOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user.userId });
  res.status(StatusCodes.OK).json({ orders, count: orders.length });
};

export const updateOrder = async (req, res) => {
  const { id: orderId } = req.params;
  const { paymentIntentId } = req.body;

  const order = await Order.findOne({ _id: orderId });
  if (!order) {
    throw new NotFoundError(`No order found with id : ${orderId}`);
  }
  validatePermission(req.user, order.user);

  order.paymentIntentId = paymentIntentId;
  order.status = 'paid';
  await order.save();

  res.status(StatusCodes.OK).json({ order });
};
