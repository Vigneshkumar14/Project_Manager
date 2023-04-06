import mongoose from "mongoose";
import Defect from "../models/defectSchema.js";
import formidable from "formidable";
import asyncHandler from "../services/asyncHandler.js";
import fs from "fs";
import CustomError from "../utils/customError.js";
import { uploadFile, deleteFile } from "../services/uploadAttachments.js";
import cloudinary from "../config/couldinary.config.js";

const createDefect = asyncHandler(async (req, res) => {
  let { _id: createdBy } = req.user;

  const form = formidable({
    multiples: true,
    keepExtensions: true,
    maxFileSize: 5 * 1024 * 1024, // 5 MB
  });

  form.parse(req, async function (err, fields, files) {
    console.log(files);
    try {
      if (err) throw new CustomError(err.message || "Formidable error", 500);

      const { title, assignee, status, project, comments, description } =
        fields;
      if (!title || !description) {
        throw new CustomError("Please enter the title", 401);
      }

      let userDefectId = String(await Defect.count({}));

      userDefectId = "DE-" + userDefectId.padStart(4, "0");

      const defectCheck = await Defect.findOne({ userDefectId: userDefectId });

      if (defectCheck) {
        throw new CustomError(
          "Defect number error please contact your administrator",
          401
        );
      }

      let defectId = new mongoose.Types.ObjectId().toHexString();
      let fileArray = undefined;

      if (
        Object.keys(files).length > 0 &&
        Object.keys(files.attachments).length !== 0
      ) {
        const attachmentss = [];

        // for (const file of files.attachments) {
        //   const attachment = {
        //     fileName: file.originalFilename,
        //     path: file.filepath,
        //     format: file.originalFilename.split(".").pop(),
        //   };
        //   attachmentss.push(attachment);
        // }
        files.attachments.map((file) => {
          const attachment = {
            fileName: file.originalFilename,
            path: file.filepath,
            format: file.originalFilename.split(".").pop(),
          };
          attachmentss.push(attachment);
        });

        let fileArrayResp = Promise.all(
          attachmentss.map(async (fileKey, index) => {
            let fileData = {
              id: `${defectId}_${createdBy}_${fileKey.fileName}`,
              name: fileKey.fileName,
              pathName: "ProjectManagement",
              path: fileKey.path,
            };

            const result = await uploadFile(fileData);

            return {
              fileName: fileKey.fileName,
              format: fileKey.format,
              fileLink: result.secure_url,
              uploadedBy: createdBy,
              public_id: result.public_id,
            };
          })
        );

        fileArray = await fileArrayResp;
      }

      const defect = await Defect.create({
        _id: defectId,
        title,
        description,
        assignee,
        createdBy,
        attachments: fileArray,
        userDefectId,
        Comments: {
          Comment: comments,
          userId: createdBy,
          createdAt: Date.now(),
        },
        status,
        project,
      });

      return res.status(201).json({
        success: true,
        message: "Defect Created Successfully",
        defect,
      });
    } catch (err) {
      console.log(err);
      throw new CustomError(
        err.message || "Error occured while creating a defect",
        500
      );
    }
  });
});

const getAllUserCreatedDefect = asyncHandler(async (req, res) => {
  const { _id: id } = req.user;

  if (!id) throw new CustomError("Please login again", 402);
  const defect = await Defect.find(
    { createdBy: id },
    "userDefectId title assignee status createdAt"
  )
    .populate("assignee", "name email")
    .sort({ createdAt: -1 });

  if (defect.length === 0) {
    return res.status(200).json({
      success: true,
      message: "No defects were created by user",
    });
  }
  return res.status(200).json({
    success: true,
    defect,
  });
});

const deleteFileDefect = asyncHandler(async (req, res) => {
  let { id, defectId } = req.body;
  // Checking if id & defectId exists
  if (!id || !defectId) throw new CustomError("Requested Id is not found", 401);

  id = new mongoose.Types.ObjectId(id);
  defectId = new mongoose.Types.ObjectId(defectId);

  const defectFile = await Defect.findByIdAndUpdate(
    { _id: defectId },
    { $pull: { attachments: { _id: id } } },
    { new: false }
  );
  if (!defectFile) throw new CustomError("Doesn't Exist", 401);

  let pId = "";

  defectFile.attachments.map((df) => {
    if (df._id.toString() == id.toString()) {
      pId = df.public_id;
    }
  });

  const result = await cloudinary.uploader.destroy(pId);

  if (result.result !== "ok") throw new CustomError("File not found", 500);

  return res.status(200).json({
    success: true,
    message: "File deleted sucessfully",
  });
});

const updateDefect = asyncHandler(async (req, res) => {
  const { defectId } = req.params;
  const { ...updates } = req.body;

  const defect = await Defect.findOne({
    _id: defectId,
  });
  // const defect = await Defect.findOne({
  //   $or: [{ defectId }, { userDefectId }],
  // });

  if (!defect) throw new CustomError("Defect not found", 404);

  // Check if the current user is authorized to update the defect
  // if (defect.createdBy.toString() !== req.user._id.toString()) {
  // throw new CustomError("Unauthorized to update this defect",403)
  // }

  // Create an object with the fields that need to be updated
  const newFields = {};
  Object.keys(updates).forEach((key) => {
    if (defect[key] !== undefined) {
      newFields[key] = updates[key];
      // console.log("new Fields of key", key, newFields[key]);
      // console.log("updates of key --------", key, updates[key]);
    }
  });

  // Merge the new fields with the existing fields of the document
  const updatedDefect = Object.assign(defect, newFields);

  // // Save the updated document to the database
  const updatedResult = await updatedDefect.save();

  return res.json({
    UpdatedFields: newFields,
    success: true,
    message: `Values of ${Object.keys(
      newFields
    ).toString()} are updated successfully in defect`,
    updatedResult,
  });
});

const addComment = asyncHandler(async (req, res) => {
  const { defectId, commentId } = req.params;
  const { Comment } = req.body;
  const { _id: userId } = req.user;

  if (!defectId) throw new CustomError("Please refresh and try again", 401);
  if (!Comment) throw new CustomError("Please enter the Comment", 401);

  const defect = await Defect.findById(defectId);
  if (!defect) throw new CustomError("Defect not found", 404);

  if (commentId) {
    const commentIndex = defect.Comments.findIndex(
      (comment) => comment._id.toString() === commentId
    );
    if (commentIndex !== -1) {
      if (
        !(userId.toString() === defect.Comments[commentIndex].userId.toString())
      )
        throw new CustomError(
          "Not authorized to edit this comment as this was not added by you",
          401
        );
      const editedDefect = await Defect.findOneAndUpdate(
        {
          _id: defectId,
          "Comments._id": commentId,
        },
        {
          $set: {
            "Comments.$.Comment": Comment,
            "Comments.$.lastUpdated": new Date(),
            "Comments.$.modifed": true,
          },
        },
        { new: true }
      );

      return res.status(200).json({
        success: true,
        messgae: "Comment is updated",
        editedDefect,
      });
    }
  }
  const newComment = {
    userId: userId,
    Comment: Comment,
    createdAt: new Date(),
  };
  // console.log(newComment);

  defect.Comments.push(newComment);

  defect.save();
  return res.status(200).json({
    success: true,
    message: "New Comment is added",
    defect,
  });
});

const deleteComment = asyncHandler(async (req, res) => {
  const { defectId, commentId } = req.params;
  const { _id: userId } = req.user;

  if (!defectId) throw new CustomError("Please refresh and try again", 401);
  if (!commentId) throw new CustomError("Please refresh and try again", 401);

  const defect = await Defect.findOneAndUpdate(
    {
      _id: defectId,
    },
    { $pull: { Comments: { _id: commentId, userId: userId } } },
    { new: true }
  );

  if (!defect) throw new CustomError("Defect not Found", 404);
  else if (!defect.Comments.some((comment) => comment._id.equals(commentId))) {
    throw new CustomError("Comment not found", 404);
  } else if (
    defect.Comments.some(
      (comment) => comment._id.equals(commentId) && comment.userId !== userId
    )
  ) {
    throw new CustomError("User not authorized", 401);
  }

  return res.status(200).json({
    success: true,
    message: "Comment deleted successfully",
    defect,
  });
});

const getDefect = asyncHandler(async (req, res) => {
  const { userDefectId } = req.params;

  if (!userDefectId)
    throw new CustomError("Not able to get the defect details", 500);

  const defect = await Defect.findOne({ userDefectId: userDefectId });

  if (!defect) throw new CustomError("Defect not found", 404);
  return res.status(200).json({
    success: true,
    message: "Defect details fetched successfully",
    defect,
  });
});

export {
  createDefect,
  getAllUserCreatedDefect,
  deleteFileDefect,
  updateDefect,
  addComment,
  deleteComment,
  getDefect,
};
