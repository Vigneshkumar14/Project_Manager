const mongoose = require("mongoose");

const { Schema } = mongoose;

const user = new Schema({
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: "Email address is required",
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  role: {
    type: Number,
    required: [true, "Error in Assigning role"],
    default: 0,
  },
  project: {
    type: String,
    default: "noproject",
  },
  position: {
    type: String,
  },
});

module.exports = mongoose.model("User", user);
