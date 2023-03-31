import express from "express";
const router = express.Router();
import {
  createDefect,
  deleteFileDefect,
  getAllUserCreatedDefect,
  updateDefect,
} from "../Controllers/dController.js";
import { isLoggedIn } from "../middlewares/Auth.middleware.js";

router.post("/create", isLoggedIn, createDefect);
router.get("/user", isLoggedIn, getAllUserCreatedDefect);
router.post("/delete", isLoggedIn, deleteFileDefect);
router.put("/update/:defectId", isLoggedIn, updateDefect);

export default router;
