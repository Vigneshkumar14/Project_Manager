const express = require("express");
const {
  createUser,
  loginUser,
  changePassword,
} = require("../Controllers/userController");
const router = express.Router();

router.post("/create", createUser);
router.post("/login", loginUser);
router.post("/changepassword/:userId", changePassword);

module.exports = router;
