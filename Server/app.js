import config from "./config/index.js";
import express from "express";
import cookieParser from "cookie-parser";
import { connectToDB } from "./config/database.js";
import userRoutes from "./Routes/userRoutes.js";
import dRoutes from "./Routes/dRoutes.js";
import projectRoutes from "./Routes/projectRoutes.js";
import cors from "cors";
const app = express();

// DB Connection
connectToDB();

app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", process.env.CLIENT_URL);
  // res.header("Access-Control-Allow-Origin", "http://192.168.29.162:3000");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept,application/json"
  );
  next();
});

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
