import { User } from "../models/userSchema.js";
import { Token } from "../models/userToken.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnauthenticatedError } from "../errors/index.js";
import {
  createCookie,
  sendVerificationEmail,
  sendResetPasswordEmail,
  hashToken,
} from "../utils/index.js";
import crypto from "crypto";

export const registerUser = async (req, res) => {
  const { name, email, password } = req?.body;

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

  const emailVerificationToken = crypto.randomBytes(40).toString("hex");

  const user = await User.create({
    name,
    email,
    password,
    role,
    emailVerificationToken: hashToken(emailVerificationToken),
  });

  const localHostOrigin = "http://localhost:3000";
  // const tempOrigin = req.get('origin');
  // const protocol = req.protocol;
  // const host = req.get('host');
  // const forwardedHost = req.get('x-forwarded-host');
  // const forwardedProtocol = req.get('x-forwarded-proto');
  await sendVerificationEmail({
    name: user.name,
    email: user.email,
    emailVerificationToken,
    origin: localHostOrigin,
  });
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
  // create refresh token
  let refreshToken = "";
  // check for existing token
  const existingToken = await Token.findOne({ user: user._id });

  if (existingToken) {
    const { isValid } = existingToken;
    if (!isValid) {
      throw new UnauthenticatedError("Invalid Credentials");
    }
    refreshToken = existingToken.refreshToken;
    await createCookie(res, tokenPayload, refreshToken);
    return res.status(StatusCodes.OK).json({ message: "cookie set" });
  }

  refreshToken = crypto.randomBytes(40).toString("hex");
  const userAgent = req.headers["user-agent"];
  const ip = req.ip;

  const userToken = await Token.create({
    refreshToken,
    ip,
    userAgent,
    user: user._id,
  });
  await createCookie(res, tokenPayload, userToken.refreshToken);
  return res.status(StatusCodes.OK).json({ message: "cookie set" });
};

export const logoutUser = async (req, res) => {
  console.log(req.user)
  await Token.findOneAndDelete({ user: req.user.userId });

  res.cookie("accessToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.cookie("refreshToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ message: "User logged out successfully!" });
};

export const verifyEmail = async (req, res) => {
  const { token, email } = req.query;
  const user = await User.findOne({ email });

  if (!user) {
    throw new UnauthenticatedError("Verification Failed");
  }

  if (user.emailVerificationToken !== hashToken(token)) {
    console.dir();
    throw new UnauthenticatedError("Verification Failed");
  }

  user.isVerified = true;
  user.verifiedDate = Date.now();
  user.emailVerificationToken = "";

  await user.save();

  res
    .status(StatusCodes.OK)
    .json({ msg: "Your Email is Verified. Please log in to continue" });
};
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new BadRequestError('Please provide valid email');
  }

  const user = await User.findOne({ email });

  if (user) {
    const passwordToken = crypto.randomBytes(70).toString('hex');
  
    await sendResetPasswordEmail({
      name: user.name,
      email: user.email,
      token: passwordToken,
      origin: "http://localhost:3000",
    });

    const expTime = 1000 * 60 * 10;
    const passwordTokenExpirationDate = new Date(Date.now() + expTime);

    user.restPasswordToken = hashToken(passwordToken);
    user.restPasswordTokenExp = passwordTokenExpirationDate;
    await user.save();
  }
  res
    .status(StatusCodes.OK)
    .json({ msg: "Please check your email for reset password link" });
};

export const resetPassword = async (req, res) => {
  const { token, email, password } = req.body;
  if (!token || !email || !password) {
    throw new BadRequestError('Please provide all values');
  }
  const user = await User.findOne({ email });

  if (user) {
    const currentDate = new Date();

    if (
      user.restPasswordToken === hashToken(token) &&
      user.restPasswordTokenExp > currentDate
    ) {
      user.password = password;
      user.passwordToken = null;
      user.restPasswordTokenExp = null;
      await user.save();
    }
  }
  res.send("reset password");
};
