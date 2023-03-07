require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT;
const { connectToDB } = require("./config/database");
const userRoutes = require("./Routes/userRoutes");

// DB Connection
connectToDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// User Routes
app.use("/api", userRoutes);

app.listen(PORT, () => {
  console.log(`Server is listeining to PORT ${PORT}`);
});
