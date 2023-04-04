import express from "express";
const router = express.Router();
import {
  addComment,
  createDefect,
  deleteComment,
  deleteFileDefect,
  getAllUserCreatedDefect,
  updateDefect,
} from "../Controllers/dController.js";
import { isLoggedIn } from "../middlewares/Auth.middleware.js";

router.post("/create", isLoggedIn, createDefect);
router.get("/user", isLoggedIn, getAllUserCreatedDefect);
router.post("/delete", isLoggedIn, deleteFileDefect);
router.put("/update/:defectId", isLoggedIn, updateDefect);
router.put("/update/:defectId/comment", isLoggedIn, addComment);
router.put("/update/:defectId/comment/:commentId", isLoggedIn, addComment);
router.delete(
  "/delete/:defectId/comment/:commentId",
  isLoggedIn,
  deleteComment
);

export default router;
