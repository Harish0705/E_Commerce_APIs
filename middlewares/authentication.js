import { User } from "../models/userSchema.js";
import jwt from "jsonwebtoken";
import { UnauthenticatedError } from "../errors/index.js";

const authMiddleware = async (req, res, next) => {
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer")) {
    throw new UnauthenticatedError("Invalid Authorization request");
  }
  const authToken = authorizationHeader.split(" ")[1];
  try {
    const userPayload = jwt.verify(authToken, process.env.JWT_SECRET);
    // console.log(userPayload);
    // attach the user to job routes
    req.user = { userId: userPayload.userdId, userName: userPayload.userName };
    // console.log(req.user);
    next();
  } catch (err) {
    // console.log(error)
    throw new UnauthenticatedError("Authentication failed");
  }
};

export default authMiddleware;
