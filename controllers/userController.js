import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors/index.js";

export const getOneUser = (req, res) => {
    res.send("One User")
}
export const getAllUsers = (req, res) => {
    res.send("All Users")
}
export const getCurrentUser = (req, res) => {
    res.send("Current User")
}

export const updateUser = (req, res) => {
    res.send("Update user")
}
export const updateUserPassword = (req, res) => {
    res.send("update password")
}
