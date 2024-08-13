import { UnauthenticatedError } from "../errors/index.js";
import { verifyAccessToken } from "../utils/index.js";

const authUserMiddleware = async (req, res, next) => {
  const accessToken = req.signedCookies.accessToken;
  if (!accessToken) {
    throw new UnauthenticatedError("Invalid credentials");
  }
  try {
    const userPayload = await verifyAccessToken(accessToken);
    req.user = {
      userId: userPayload.userdId,
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

export default authUserMiddleware;
