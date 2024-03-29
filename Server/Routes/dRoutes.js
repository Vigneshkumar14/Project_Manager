import express from "express";
const router = express.Router();
import {
  addComment,
  assigneeAutocomplete,
  createDefect,
  dashBoard,
  dashBoardStatusUpdate,
  deleteAttachment,
  deleteComment,
  deleteFileDefect,
  getAllAssignedToUser,
  getAllDefects,
  getAllUserCreatedDefect,
  getDefect,
  searchDefect,
  updateAttachment,
  updateDefect,
} from "../Controllers/dController.js";
import { isLoggedIn } from "../middlewares/Auth.middleware.js";

router.post("/create", isLoggedIn, createDefect);
router.get("/user", isLoggedIn, getAllUserCreatedDefect);
router.get("/all", isLoggedIn, getAllDefects);
router.get("/userassignee", isLoggedIn, getAllAssignedToUser);
router.get("/dashboard", isLoggedIn, dashBoard);
router.get("/:userDefectId", isLoggedIn, getDefect);
router.post("/delete", isLoggedIn, deleteFileDefect);
router.put("/update/:defectId", isLoggedIn, updateDefect);
router.put("/update/:defectId/comment", isLoggedIn, addComment);
router.put("/update/:defectId/comment/:commentId", isLoggedIn, addComment);
router.delete(
  "/delete/:defectId/comment/:commentId/",
  isLoggedIn,
  deleteComment
);

router.put("/update/:defectId/attachment/", isLoggedIn, updateAttachment);

router.delete(
  "/delete/:defectId/attachment/:attachmentId/",
  isLoggedIn,
  deleteAttachment
);

router.get("/search/:key", isLoggedIn, searchDefect);
router.get("/search/user/:key", isLoggedIn, assigneeAutocomplete);
router.put("/dashboard/update/:id", isLoggedIn, dashBoardStatusUpdate);
export default router;
