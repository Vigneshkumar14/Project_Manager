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

      if (Object.keys(files.attachments).length !== 0) {
        const attachmentss = [];

        for (const file of files.attachments) {
          const attachment = {
            fileName: file.originalFilename,
            path: file.filepath,
            format: file.originalFilename.split(".").pop(),
          };
          attachmentss.push(attachment);
        }

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
        let fileArray = await fileArrayResp;

        const defect = await Defect.create({
          _id: defectId,
          title,
          description,
          assignee,
          createdBy,
          attachments: fileArray,
          userDefectId,
          Comments: {
            defectdescription: comments,
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
      }
    } catch (err) {
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

export { createDefect, getAllUserCreatedDefect, deleteFileDefect };
