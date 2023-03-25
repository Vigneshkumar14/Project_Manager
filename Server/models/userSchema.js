import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import config from "../config/index.js";
import cookieOptions from "../utils/cookieOptions.js";
import JWT from "jsonwebtoken";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
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
    // otp: {
    //   type: String,
    //   default: "",
    //   createdAt: { type: Date, expires: "2m", default: Date.now },
    // },
    project: {
      type: String,
      default: "noproject",
    },
    position: {
      type: String,
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
};
export default mongoose.model("User", userSchema);
