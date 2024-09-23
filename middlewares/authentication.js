import { UnauthenticatedError, UnauthorizedError } from "../errors/index.js";
import { verifyAccessToken } from "../utils/index.js";
import { Token } from "../models/userToken.js";
import { hashToken } from "../utils/index.js";

const authUserMiddleware = async (req, res, next) => {
  const { accessToken, refreshToken } = req.signedCookies;

  try {
   if (accessToken) {
      const payload = verifyAccessToken(accessToken);
      req.user = {
        userId: payload.user.userId,
        userName: payload.user.name,
        userRole: payload.user.role,
      };
      return next();
    }
    const payload = verifyAccessToken(refreshToken);

    const existingToken = await Token.findOne({
      user: payload.user.userId,
      refreshToken:payload.userRefreshToken,
    });

    if (!existingToken || !existingToken?.isValid) {
      throw new UnauthenticatedError("Authentication Invalid");
    }

    req.user = {
      userId: payload.user.userId,
      userName: payload.user.name,
      userRole: payload.user.role,
    };
    console.log(req.user)
    next();
  } catch (error) {
    throw new UnauthenticatedError("Invalid credentials");
  }
};

const authorizePermission = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.userRole)) {
      throw new UnauthorizedError("Unauthorized to access this url");
    }
    next();
  };
};

export { authUserMiddleware, authorizePermission };
