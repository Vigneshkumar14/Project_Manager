import express from "express";
import {
  addCollaborators,
  createProject,
  deleteProject,
  getAllProject,
  getProjectWithId,
  updateProject,
} from "../Controllers/projectController.js";
import { isLoggedIn } from "../middlewares/Auth.middleware.js";
import { isAdmin } from "../middlewares/Admin.middleware.js";
const router = express.Router();

router.post("/create", isLoggedIn, isAdmin, createProject);
router.put("/edit/:projectId", isLoggedIn, updateProject);
router.put("/edit/:projectId/addcollabarators", isLoggedIn, addCollaborators);
router.delete("/delete/:projectId", isLoggedIn, isAdmin, deleteProject);
router.get("/:projectId", isLoggedIn, getProjectWithId);
router.get("/", isLoggedIn, isAdmin, getAllProject);

export default router;
