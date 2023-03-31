import asyncHandler from "../services/asyncHandler.js";
import CustomError from "../utils/customError.js";
import JWT from "jsonwebtoken";
import config from "../config/index.js";
import User from "../models/userSchema.js";

export const isLoggedIn = asyncHandler(async (req, _res, next) => {
  let token = req.cookies.token;
  if (!token)
    throw new CustomError(
      `token doesn't exist, Please try logging in again`,
      401
    );

  try {
    // Verifying the JWT token that is being fetched from Browser and verifying by comparing the secret
    const decodeJwtPayload = JWT.verify(token, config.SECRET);
    if (!decodeJwtPayload.id)
      throw new CustomError(
        "Something went wrong, Please try logging in again",
        401
      );
    req.user = await User.findById(decodeJwtPayload.id, "email role");

    // console.log(req.user._id.toString());
    next();
  } catch (err) {
    throw new CustomError(
      `Not authorized to access this route, If this is a wrong message kindly contact you admin`,
      401
    );
  }
});
