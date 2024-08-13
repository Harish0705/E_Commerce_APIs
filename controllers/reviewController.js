import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors/index.js";

export const createReview = (req, res) => {
    res.send("Create Review")
}
export const getOneReview = (req, res) => {
    res.send("One Review")
}
export const getAllReviews = (req, res) => {
    res.send("All Review")
}

export const updateReview = (req, res) => {
    res.send("Update Review")
}
export const deleteReview = (req, res) => {
    res.send("delete Review")
}
