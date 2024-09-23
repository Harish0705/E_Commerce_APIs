import crypto from "crypto";

export const hashToken = (token) =>
  crypto.createHash("md5").update(token).digest("hex");
