import mongoose from "mongoose";

const { Schema } = mongoose;

let Status = [
  "new",
  "not started",
  "in progress",
  "testing in progress",
  "retest",
  "closed",
  "reopened",
  "rejected",
];

const defect = new Schema(
  {
    defectId: {
      type: Schema.Types.ObjectId,
    },
    userDefectId: {
      type: String,
      maxlength: 10,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    attachments: [
      {
        fileName: String,
        format: String,
        fileLink: String,
        public_id: String,
        uploadedBy: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        uploadedOn: Date,
      },
    ],
    description: {
      type: String,
      required: [true, "Description should be filled to create the defect"],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    assignee: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: Status,
      default: Status[0],
      required: true,
    },
    lastUpdated: {
      type: Date,
    },
    project: {
      type: String,
    },
    Comments: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: "User",
          require: [true, "userId is mandatory to add comments"],
        },
        Comment: { type: String },
        lastUpdated: {
          type: Date,
        },
        createdAt: Date,
        modifed: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Defect", defect);
