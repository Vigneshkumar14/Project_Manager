import express from "express";
import {
  createUser,
  loginUser,
  changePassword,
  logout,
  forgotPassword,
  resetPassword,
  checkAuth,
  editUser,
} from "../Controllers/userController.js";
import { isLoggedIn } from "../middlewares/Auth.middleware.js";
const router = express.Router();

router.post("/create", createUser);
router.post("/login", loginUser);
router.put("/changepassword/:userId", isLoggedIn, changePassword);
router.get("/logout", logout);
router.post("/forgotpassword", forgotPassword);
router.post("/forgotpassword/resetpassword", resetPassword);
router.get("/checkauth", isLoggedIn, checkAuth);
router.put("/edituser", isLoggedIn, editUser);

export default router;
