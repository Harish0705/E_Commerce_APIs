import { UnauthenticatedError, UnauthorizedError } from "../errors/index.js";
import { verifyAccessToken } from "../utils/index.js";

const authUserMiddleware = async (req, res, next) => {
  const accessToken = req.signedCookies.accessToken;
  if (!accessToken) {
    throw new UnauthenticatedError("Invalid credentials");
  }
  try {
    const userPayload = await verifyAccessToken(accessToken);
    req.user = {
      userId: userPayload.userId,
      userName: userPayload.name,
      userRole: userPayload.role,
    };
    // console.log(req.user);
    next();
  } catch (err) {
    // console.log(error)
    throw new UnauthenticatedError("Authentication failed");
  }
};

const authorizePermission = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.userRole)) {
      throw new UnauthorizedError(
        "Unauthorized to access this url"
      );
    }
    next();
  };
};

export { authUserMiddleware, authorizePermission };
