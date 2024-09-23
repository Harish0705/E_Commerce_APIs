import jwt from "jsonwebtoken";

export const creatJwtToken = ({ payload }) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};

export const createCookie = async (res, user, userRefreshToken) => {
  const accessToken = creatJwtToken({ payload: { user } });
  const refreshToken = creatJwtToken({ payload: { user, userRefreshToken } });

  const accessTokenExpiryTime = 1000 * 60 * 15;
  const refreshTokenExpiryTime = 1000 * 60 * 60 * 24 * 30;
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    expires: new Date(Date.now() + accessTokenExpiryTime),
    secure: process.env.NODE_ENV === "production",
    signed: true,
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    signed: true,
    expires: new Date(Date.now() + refreshTokenExpiryTime),
  });
};

export const verifyAccessToken = (authToken) =>
  jwt.verify(authToken, process.env.JWT_SECRET);
