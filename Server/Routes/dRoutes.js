const express = require("express");
const router = express.Router();
const { createDefect } = require("../Controllers/dController");

router.post("/created", createDefect);
module.exports = router;
