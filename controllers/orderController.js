import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors/index.js";

export const createOrder = (req, res) => {
  res.send("Create order");
};

export const getOneOrder = (req, res) => {
  res.send("One Order");
};

export const getAllOrders = (req, res) => {
  res.send("All Orders");
};

export const getCurrentUserOrders = (req, res) => {
  res.send("Current Order");
};

export const updateOrder = (req, res) => {
  res.send("Update Order");
};
