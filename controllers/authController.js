import { User } from "../models/userSchema.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnauthenticatedError } from "../errors/index.js";
import { createCookie } from "../utils/index.js";

export const registerUser = async (req, res) => {
  const { name, email, password } = req?.body;
  console.log(req.body);
  if (!name || !email || !password)
    throw new BadRequestError("Please provide the required fields");
  // check if the email adready exists
  const isEmailAlreadyUsed = await User.findOne({ email });
  if (isEmailAlreadyUsed) {
    throw new BadRequestError(
      "Email already in use. Please provide another email"
    );
  }
  // temporary logic to add admin
  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = !isFirstAccount ? "user" : "admin";

  await User.create({ name, email, password, role });
  return res
    .status(StatusCodes.OK)
    .json({ message: "Successfully registered. Please log in to continue" });
};

export const loginUser = async (req, res) => {
  const { email, password } = req?.body;
  if (!email || !password)
    throw new BadRequestError("Please provide the required fields");
  const user = await User.findOne({ email });
  if (!user) throw new UnauthenticatedError("Invalid user credentials");

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) throw new UnauthenticatedError("Incorrect password");
  const tokenPayload = {
    name: user.name,
    userId: user._id,
    role: user.role,
  };
  await createCookie(res, tokenPayload);
  return res.status(StatusCodes.OK).json({ message: "cookie set" });
};

export const logoutUser = async (req, res) => {
  //set access token value to logout
  res.cookie("accessToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now() + 1000),
  });
  res.status(StatusCodes.OK).json({ message: "User logged out successfully!" });
};
