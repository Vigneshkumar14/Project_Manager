import express from "express";
const router = express.Router();
import { createDefect } from "../Controllers/dController.js";

router.post("/created", createDefect);
export default router;
