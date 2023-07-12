import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import config from "../config/index.js";
import cookieOptions from "../utils/cookieOptions.js";
import JWT from "jsonwebtoken";
import crypto from "crypto";

const { Schema } = mongoose;

const avatarValues = {
  avatar1:
    "https://res.cloudinary.com/dingkurgz/image/upload/v1683862655/ProjectManagement/Avatar/256_1_jmvtrw.png",
  avatar2:
    "https://res.cloudinary.com/dingkurgz/image/upload/v1683862655/ProjectManagement/Avatar/256_13_ljjdpo.png",
  avatar3:
    "https://res.cloudinary.com/dingkurgz/image/upload/v1683862655/ProjectManagement/Avatar/256_15_vd6kdy.png",
  avatar4:
    "https://res.cloudinary.com/dingkurgz/image/upload/v1683862654/ProjectManagement/Avatar/256_9_nz5lc2.png",
  avatar5:
    "https://res.cloudinary.com/dingkurgz/image/upload/v1683862654/ProjectManagement/Avatar/256_12_mq8rla.png",
  avatar6:
    "https://res.cloudinary.com/dingkurgz/image/upload/v1683862654/ProjectManagement/Avatar/256_6_jtt5xc.png",
};

const defaultAvatar =
  Object.keys(avatarValues)[
    Math.floor(Math.random() * Object.keys(avatarValues).length)
  ];

const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Name is required"],
      select: false,
    },
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
      select: false,
    },
    role: {
      type: Number,
      required: [true, "Error in Assigning role"],
      default: 0,
    },
    otp: {
      type: String,
      createdAt: { type: Date, expires: "10m", default: Date.now },
    },
    projects: [
      {
        type: Schema.Types.ObjectId,
        ref: "Project",
      },
    ],
    position: {
      type: String,
    },
    avatar: {
      type: String,
      enum: {
        values: Object.values(avatarValues),
        message: "Invalid avatar option",
      },
      default: avatarValues[defaultAvatar],
    },
  },
  { timestamps: true }
);

// Pre hook. Before saving the values to Database from below function will be encrypting the passwords and then values will be commited to database.

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, Number(config.SALTROUNDS));
  return next();
});

userSchema.methods = {
  // Function to compare the User entered password and encrypted password(In DB).
  comparePassword: async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  },
  getJWTtoken: function () {
    return JWT.sign(
      {
        id: this._id,
        role: this.role,
        email: this.email,
      },
      config.SECRET,
      {
        expiresIn: config.EXPIRY,
      }
    );
  },
  getOtp: function () {
    const genOtp = String(Math.floor(Math.random() * 9999)).padStart(4, 0);
    this.otp = crypto
      .createHash("sha256", config.SECRET)
      .update(genOtp)
      .digest("hex");
    return genOtp;
  },
};
export default mongoose.model("User", userSchema);
