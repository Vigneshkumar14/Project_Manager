import express from "express";
const router = express.Router();
import {
  createDefect,
  deleteFileDefect,
  getAllUserCreatedDefect,
} from "../Controllers/dController.js";
import { isLoggedIn } from "../middlewares/Auth.middleware.js";

router.post("/defect/create", isLoggedIn, createDefect);
router.get("/defect/user", isLoggedIn, getAllUserCreatedDefect);
router.post("/defect/delete", isLoggedIn, deleteFileDefect);

export default router;
