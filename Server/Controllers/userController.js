const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/userSchema");
const saltRounds = process.env.SALTROUNDS;

const createUser = async (req, res) => {
  const { email, password, role } = req.body;

  //   Check if email and password is blank
  if (!email || !password) {
    return res.status(401).json({
      success: true,
      message: "Email or Password should not br blank",
    });
  }

  // Check if user already exist in database

  let checkUser = await User.findOne({ email });
  if (checkUser)
    return res
      .status(401)
      .json({ success: false, message: "Email already exits" });

  // Hasing the password to store in database

  const enp = bcrypt.genSalt(Number(saltRounds), (err, salt) => {
    bcrypt.hash(password, salt, async (err, hash) => {
      // Creating the new user

      const user = await User.create({
        email: email,
        password: hash,
        role: role,
      });

      user.password = undefined;
      user.role = undefined;

      return res.status(201).json({
        success: true,
        user,
      });
    });
  });
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({
        success: false,
        message: "Please enter the email & password",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User doen't exist",
      });
    }
    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) {
      return res.status(401).json({
        success: false,
        message: "User Email or Password is worng, Please try again",
      });
    }

    user.password = undefined;
    user.role = undefined;

    return res.status(201).json({
      success: true,
      message: "User authenticated",
      user,
    });
  } catch (err) {
    console.log(err);
  }
};

const changePassword = async (req, res) => {
  try {
    const { email, oldPassword, newPassword } = req.body;
    const { userId } = req.params;
    if (!email || !oldPassword || !newPassword) {
      return res.status(401).json({
        success: false,
        message: "Please enter Email, Password & New Password",
      });
    }

    if (oldPassword == newPassword) {
      return res.status(401).json({
        success: false,
        message: "Your old password and new password cannot be same",
      });
    }
    const user = await User.findOne({ _id: userId });
    const matchPassword = await bcrypt.compare(oldPassword, user.password);
    if (!matchPassword) {
      return res.status(401).json({
        success: false,
        message: "Your Current password doesn't match, Kindly try again",
      });
    }

    bcrypt.genSalt(Number(saltRounds), (err, salt) => {
      bcrypt.hash(newPassword, salt, async (err, hash) => {
        // Creating the new user

        const updateUser = await User.findOneAndUpdate(
          { email },
          {
            password: hash,
          }
        );

        user.password = undefined;
        user.role = undefined;

        return res.status(201).json({
          success: true,
          message: "Password changed successfully",
          user,
        });
      });
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = { createUser, loginUser, changePassword };
