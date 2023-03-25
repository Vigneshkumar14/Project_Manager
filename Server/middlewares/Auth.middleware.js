import asyncHandler from "../services/asyncHandler.js";
import CustomError from "../utils/customError.js";
import JWT from "jsonwebtoken";
import config from "../config/index.js";
import User from "../models/userSchema.js";

export const isLoggedIn = asyncHandler(async (req, _res, next) => {
  console.log(req.cookie);
  let token = req.cookie;
  //   console.log(token);
  if (!token)
    throw new CustomError(
      `token doesn't exist, Please try logging in again`,
      401
    );

  try {
    const decodeJwtPayload = JWT.verify(token, config.SECRET);
    req.user = await User.findById(decodeJwtPayload.id, "email role");
    next();
  } catch (err) {
    throw new CustomError(
      `Not authorized to access this route, If this is a wrong message kindly contact you admin`,
      401
    );
  }
});
