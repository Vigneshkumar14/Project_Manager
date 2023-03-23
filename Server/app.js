const express = require("express");
const app = express();
const PORT = process.env.PORT;
const { connectToDB } = require("./config/database");
const userRoutes = require("./Routes/userRoutes");
const dRoutes = require("./Routes/dRoutes");
const config = require("./config/index");

// DB Connection
connectToDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// User Routes
app.use("/api", userRoutes);

// Defect Routes
app.use("/api", dRoutes);

app.listen(PORT, () => {
  console.log(`Server is listeining to PORT ${config.PORT}`);
});
