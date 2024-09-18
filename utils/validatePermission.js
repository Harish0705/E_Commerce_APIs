import { UnauthorizedError } from "../errors/index.js";

export const validatePermission = async (loggedInUser, loggedInuserId) => {
  if (loggedInUser.userRole === "admin") return;
  // compare loggedIn user id and the user id used in the schema for the product, review, order
  if (loggedInUser.userId === loggedInuserId.toString()) return;
  throw new UnauthorizedError("Not autorized to access this url");
};
