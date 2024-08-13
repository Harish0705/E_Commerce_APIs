import { UnauthorizedError } from "../errors/index.js";

export const validatePermission = async (loggedInUser, loggedInuserId) => {
  if (loggedInUser.userRole === "admin") return;
  console.log(loggedInUser.userId)
  if (loggedInUser.userId === loggedInuserId.toString()) return;
  throw new UnauthorizedError("Not autorized to access this url");
};
