import mongoose from "mongoose";

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
  collaborators: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

projectSchema.methods.addCollaborators = function (userIds) {
  return new Promise((resolve, reject) => {
    for (let user of userIds) {
      this.collaborators.addToSet(user.trim());
    }

    resolve(this.save());
  });
};

export default mongoose.model("Project", projectSchema);
