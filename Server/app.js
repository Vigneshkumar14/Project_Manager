import config from "./config/index.js";
import express from "express";
import cookieParser from "cookie-parser";
import { connectToDB } from "./config/database.js";
import userRoutes from "./Routes/userRoutes.js";
import dRoutes from "./Routes/dRoutes.js";
import projectRoutes from "./Routes/projectRoutes.js";
const app = express();

// DB Connection
connectToDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Cookie Parser to get cookies in req.cookie
app.use(cookieParser());

// User Routes
app.use("/api", userRoutes);

// Defect Routes
app.use("/api/defect", dRoutes);

// Project Routes
app.use("/api/project", projectRoutes);

app.listen(config.PORT, () => {
  console.log(`Server is listeining to PORT ${config.PORT}`);
});
