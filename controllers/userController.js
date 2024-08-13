import { User } from "../models/userSchema.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import { validatePermission } from "../utils/index.js";
import isEmpty from "lodash.isempty";

export const getAllUsers = async (req, res) => {
  // get all users by not selecting the password field
  const users = await User.find({ role: "user" }).select("-password");
  if (isEmpty(users)) throw new NotFoundError("No users found");
  return res.status(StatusCodes.OK).json(users);
};

export const getOneUser = async (req, res) => {
  const { params: { id = "" } = "", user: loggedInUser = {} } = req || {};
  const user = await User.findOne({ _id: id }).select("-password");
  //   console.log(loggedInUser);
  if (!user) throw new NotFoundError(`No user found with this id ${id}`);
  //   console.log(user);
  await validatePermission(loggedInUser, user._id);
  return res.status(StatusCodes.OK).json(user);
};

// controller test the order of middleware 
export const getCurrentUser = async (req, res) => {
  return res.status(StatusCodes.OK).json({ user: req.user });
};

export const updateUser = async (req, res) => {
  const {
    params: { id = "" } = "",
    body: { email = "", name = "" } = "",
    user: loggedInUser = {},
  } = req || {};
  if (!(email || name)) {
    throw new BadRequestError("Email and name are required");
  }
  const user = await User.findOne({ _id: id }).select("-password");
  if (!user) throw new NotFoundError(`No user found with this id ${id}`);
  await validatePermission(loggedInUser, user._id);
  if (name) user.name = name;
  if (email) user.email = email;
  await user.save(); // not on model, on the user object
  return res.status(StatusCodes.OK).json(user);
};
export const updateUserPassword = async (req, res) => {
  const {
    params: { id = "" } = "",
    body: { currentPassword = "", newPassword = "" } = "",
    user: loggedInUser = {},
  } = req || {};
  if (!currentPassword || !newPassword) {
    throw new BadRequestError(
      "Both current and new password fields are required"
    );
  }
  const user = await User.findOne({ _id: id });
  console.log(user);
  if (!user) throw new NotFoundError(`No user found with this id ${id}`);
  await validatePermission(loggedInUser, user._id);
  const isPasswordCorrect = await user.comparePassword(currentPassword);
  if (!isPasswordCorrect)
    throw new UnauthenticatedError("Incorrect current password");
  if (newPassword) user.password = newPassword;
  await user.save(); // not on model, on the user object
  // clear cookie and inform the user to log in again
  return res
    .cookie("accessToken", "logout", {
      httpOnly: true,
      expires: new Date(Date.now() + 1000),
    })
    .status(StatusCodes.OK)
    .send("Password updated. Please login to continue");
};
