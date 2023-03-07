const mongoose = require("mongoose");

const { Schema } = mongoose;

const project = new Schema({});

module.exports = mongoose.model("Project", project);
