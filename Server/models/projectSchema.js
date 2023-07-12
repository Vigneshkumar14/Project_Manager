import mongoose from "mongoose";
import User from "./userSchema.js";

const { Schema } = mongoose;

const projectSchema = new Schema({
  title: { type: String, required: [true, "Title is mandatory field"] },
  description: {
    type: String,
    required: [true, "description is mandatory field"],
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  collaborators: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  created: {
    type: Date,
    default: Date.now,
  },
});

projectSchema.methods.addCollaborators = function (userIds) {
  return new Promise(async (resolve, reject) => {
    try {
      for (let user of userIds) {
        this.collaborators.addToSet(user.trim());
      }

      await this.save();

      await User.updateMany(
        { _id: { $in: userIds } },
        { $addToSet: { projects: this._id } }
      );

      resolve(this);
    } catch (err) {
      reject(err);
    }
  });
};

export default mongoose.model("Project", projectSchema);
