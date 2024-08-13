import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors/index.js";

export const createProduct = (req, res) => {
    res.send("Create product")
}
export const getOneProduct = (req, res) => {
    res.send("One product")
}
export const getAllProducts = (req, res) => {
    res.send("All product")
}

export const updateProduct = (req, res) => {
    res.send("Update product")
}
export const deleteProduct = (req, res) => {
    res.send("delete product")
}
