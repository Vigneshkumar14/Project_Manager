import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/userSchema.js";
import asyncHandler from "../services/asyncHandler.js";
import CustomError from "../utils/customError.js";
import cookieOptions from "../utils/cookieOptions.js";

/******************************************************
 * @SIGNUP
 * @REQUEST_TYPE POST
 * @route http://localhost:8000/api/create
 * @description User signUp Controller for creating new user
 * @parameters name, email, role
 * @returns User Object
 ******************************************************/

const createUser = asyncHandler(async (req, res) => {
  const { email, password, role } = req.body;

  //   Check if email and password is blank
  if (!email || !password) {
    throw new CustomError("Email or Password should not br blank", 400);
  }

  // Check if user already exist in database

  let checkUser = await User.findOne({ email });
  if (checkUser) throw new CustomError("Email already exits", 401);

  // Hasing the password to store in database
  // Creating the new user
  const user = await User.create({
    email: email,
    password: password,
    role: role,
  });

  // If user is created then sending cookie as response to the browser
  const token = user.getJWTtoken();
  res.cookie("token", token, cookieOptions);

  user.password = undefined;
  user.role = undefined;

  return res.status(201).json({
    success: true,
    token,
    user,
  });
});

/******************************************************
 * @LOGIN
 * @REQUEST_TYPE POST
 * @route http://localhost:8000/api/login
 * @description User login Controller for creating logging in as a user
 * @parameters email, password
 * @returns User Object
 ******************************************************/

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Checking if the email and password values are coming from user
  if (!email || !password)
    throw new CustomError("Please enter the email & password", 401);

  // Trying to find the email in the Database
  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new CustomError("User doen't exist", 401);

  // Comparig the Passwords

  const matchPassword = await user.comparePassword(password);

  if (!matchPassword)
    throw new CustomError(
      "User Email or Password is worng, Please try again",
      401
    );

  // If password is matched generating the token

  const token = await user.getJWTtoken();

  res.status(201).cookie("token", token, cookieOptions);

  user.password = undefined;
  user.role = undefined;
  return res.status(201).json({
    success: true,
    message: "User authenticated",
    user,
    token,
  });
});

/******************************************************
 * @CHANGEPASSWORD
 * @REQUEST_TYPE POST
 * @route http://localhost:8000/api/changepassword/:user_Id
 * @description User signUp Controller for creating new user
 * @parameters email, oldPassword, newPassword
 * @returns User Object
 ******************************************************/

const changePassword = asyncHandler(async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;
  const { userId } = req.params;
  if (!email || !oldPassword || !newPassword)
    throw new CustomError("Please enter Email, Password & New Password", 401);

  if (oldPassword == newPassword)
    throw new CustomError(
      "Your old password and new password cannot be same",
      401
    );

  const user = await User.findOne({ _id: userId }).select("+password");
  const matchPassword = await user.comparePassword(oldPassword);
  if (!matchPassword)
    throw new CustomError(
      "Your Current password doesn't match, Kindly try again",
      401
    );

  user.password = newPassword;
  await user.save();

  user.password = undefined;
  user.role = undefined;

  return res.status(201).json({
    success: true,
    message: "Password changed successfully",
    user,
  });
});

/******************************************************
 * @LOGOUT
 * @REQUEST_TYPE GET
 * @route http://localhost:8000/api/logout
 * @description User logout Controller for remove the cookies from the browser
 * @parameters NA
 * @returns NA
 ******************************************************/
const logout = (req, res) => {
  // Clearing the cookies in browser
  return res.clearCookie("token").status(201).json({
    sucess: true,
    message: "Logged out successfully",
  });
};

export { createUser, loginUser, changePassword, logout };
