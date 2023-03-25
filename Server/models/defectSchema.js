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
        uploadedBy: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        uploadedOn: Date,
      },
    ],

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
    CreatedOn: {
      type: Date,
      required: true,
      default: Date.now,
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
        },
        Commentss: [
          {
            defectdescription: String,
            ddate: {
              type: Date,
              default: Date.now,
            },
          },
        ],
        lastUpdated: {
          type: Date,
        },
        modifed: {
          type: Boolean,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Defect", defect);
