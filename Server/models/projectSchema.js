import mongoose from "mongoose";

const { Schema } = mongoose;

const project = new Schema({});

export default mongoose.model("Project", project);
