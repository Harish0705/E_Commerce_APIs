import jwt from "jsonwebtoken";

export const creatJwtToken = (userPayload) => {
  return jwt.sign(userPayload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};

export const createCookie = async (res, user) => {
  const accessToken = creatJwtToken(user);
  const cookieExpiryTime = 1000 * 60 * 60 * 24;
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    expires: new Date(Date.now() + cookieExpiryTime),
    secure: process.env.NODE_ENV === "production",
    signed: true,
  });
};

export const verifyAccessToken = async (authToken) =>
  jwt.verify(authToken, process.env.JWT_SECRET);
