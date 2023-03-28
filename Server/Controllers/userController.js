import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/userSchema.js";
import asyncHandler from "../services/asyncHandler.js";
import CustomError from "../utils/customError.js";
import cookieOptions from "../utils/cookieOptions.js";
import sendEmails from "../utils/mailHelper.js";
import crypto from "crypto";
import config from "../config/index.js";

/******************************************************
 * @SIGNUP
 * @REQUEST_TYPE POST
 * @route http://localhost:8000/api/create
 * @description User signUp Controller for creating new user
 * @parameters name, email, role
 * @returns User Object
 ******************************************************/

const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  //   Check if email and password is blank
  if (!email || !password || !name) {
    throw new CustomError("Email or Password should not br blank", 400);
  }

  // Check if user already exist in database

  let checkUser = await User.findOne({ email });
  if (checkUser) throw new CustomError("Email already exits", 401);

  // Hasing the password to store in database
  // Creating the new user
  const user = await User.create({
    name: name,
    email: email,
    password: password,
    role: role,
  });

  // If user is created then sending cookie as response to the browser
  const token = user.getJWTtoken();
  res.cookie("token", token, cookieOptions);

  user.password = undefined;
  user.role = undefined;
  user.name = undefined;

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
const logout = (_req, res) => {
  // Clearing the cookies in browser
  return res.clearCookie("token").status(201).json({
    sucess: true,
    message: "Logged out successfully",
  });
};

/******************************************************
 * @FORGOT_PASSWORD
 * @REQUEST_TYPE POST
 * @route http://localhost:8000/api/forgotpassword
 * @description User forgot passwword Controller to resset the password with OTP validation
 * @parameters email
 * @returns Success message
 ******************************************************/

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) throw new CustomError("Please enter the email to continue", 402);

  const user = await User.findOne({ email }).select("+name");

  if (!user) throw new CustomError("User not found", 401);

  try {
    const otp = await user.getOtp();
    await user.save({ validateBeforeSave: false });
    const options = {
      toEmail: user.email,
      subject: "Forgot Password request",
      text: `Hello ${user.name},\n Your OTP is ${otp}\nPlease enter this OTP to process your forgot password request.\n If this is not triggered by you don't share this otp with any one thanks.`,
      username: user.name,
      otp: otp,
    };
    console.log(options);
    // // Parameters required (toEmail, subject,text,username,otp)
    const emailStatus = await sendEmails(options);

    if (!emailStatus.success)
      throw new CustomError(
        "OTP not sent, Please try again after sometime",
        500
      );
    return res.status(201).json({
      success: true,
      message: "OTP has been sent successfully",
    });
  } catch (err) {
    // Deleteing the OTP from db if the Email is not sent.
    user.otp = undefined;
    user.save({ validateBeforeSave: false });
    throw new CustomError("OTP not sent, Please try again after sometime", 500);
  }
});

/******************************************************
 * @RESET_PASSWORD
 * @REQUEST_TYPE POST
 * @route http://localhost:8000/api/resetpassword
 * @description User forgot passwword Controller to resset the password with OTP validation
 * @parameters EMAIL, OTP, PASSWORD, CONFIRM PASSWORD
 * @returns Success message, User, Token
 ******************************************************/

const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, password, confirmPassword } = req.body;
  if (!(email && otp && password && confirmPassword))
    throw new CustomError("Please enter all the required fields", 401);

  if (!(password == confirmPassword))
    throw new CustomError("Password and Confirm password does't match", 401);

  const user = await User.findOne({ email }).select("+password");

  if (!user)
    throw new CustomError(
      "Error Occured not able to get the User details please try later",
      404
    );

  const encryptOtp = crypto
    .createHash("sha256", config.SECRET)
    .update(otp)
    .digest("hex");

  if (encryptOtp != user.otp) throw new CustomError("OTP doesn't match", 401);

  if (encryptOtp == user.otp) {
    user.password = password;
    user.otp = undefined;
    await user.save();
    user.password = undefined;
    const token = await user.getJWTtoken();

    res.status(200).cookie("token", token, cookieOptions);

    return res.status(200).json({
      success: true,
      messaage: "New password is saved successfully",
      user,
      token,
    });
  }
});

export {
  createUser,
  loginUser,
  changePassword,
  logout,
  forgotPassword,
  resetPassword,
};
