import mongoose from "mongoose";
import Defect from "../models/defectSchema.js";
import formidable from "formidable";
import asyncHandler from "../services/asyncHandler.js";
import User from "../models/userSchema.js";
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
  try {
    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, async function (err, fields, files) {
        if (err) {
          reject(new CustomError("Formidable error", 500));
        } else {
          resolve({ fields, files });
        }
      });
    });

    const { title, assignee, status, project, comments, description } = fields;

    if (!title || !description) {
      throw new CustomError("Please enter the title and description", 401);
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

    let updatedFiles = "";
    if (typeof files === "object" && files !== null) {
      updatedFiles = Object.values(files);
    }
    updatedFiles = updatedFiles.flat();

    if (updatedFiles.length > 0) {
      const attachmentss = [];
      const uploadData = updatedFiles;
      // Array.isArray(updatedFiles)
      //   ? updatedFiles
      //   : [updatedFiles];

      for (const file of uploadData) {
        console.log("File", file);
        const attachment = {
          fileName: file.originalFilename,
          path: file.filepath,
          format: String(file.originalFilename).split(".").pop(),
        };
        console.log("Attachment", attachment);
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
          try {
            const result = await uploadFile(fileData);

            return {
              fileName: fileKey.fileName,
              format: fileKey.format,
              fileLink: result.secure_url,
              uploadedBy: createdBy,
              public_id: result.public_id,
              uploadedOn: new Date(),
            };
          } catch (err) {
            throw new CustomError(
              err.message || "Error while uploading the file",
              500
            );
          }
        })
      );

      try {
        fileArray = await fileArrayResp;
        console.log("fileArray", fileArray);
      } catch (err) {
        throw new CustomError(
          err.message || "Error occured while uploading",
          500
        );
      }
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

const getAllUserCreatedDefect = asyncHandler(async (req, res) => {
  const { _id: id } = req.user;

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 4;
  const startIndex = (page - 1) * limit;
  const lastIndex = page * limit;
  const totalRecords = await Defect.countDocuments({ createdBy: id });
  const totalPages = Math.ceil(totalRecords / limit);

  if (totalRecords > 0 && page > totalPages)
    throw new CustomError("Page doesn't exist", 404);

  if (!id) throw new CustomError("Please login again", 402);
  const defect = await Defect.find(
    { createdBy: id },
    "userDefectId title assignee status createdAt"
  )
    .populate("assignee", "name email")
    .sort({ createdAt: -1 })
    .skip(startIndex)
    .limit(limit);

  const pages = {
    totalPages,
    totalRecords,
    page,
    limit,
  };

  if (lastIndex < totalRecords) {
    pages.next = {
      page: page + 1,
    };
  }
  if (startIndex > 0) {
    pages.prev = {
      page: page - 1,
    };
  }

  if (defect.length === 0) {
    return res.status(200).json({
      success: true,
      message: "No defects were created by user",
    });
  }
  return res.status(200).json({
    success: true,
    message: "User created defects are fetched successfully",
    defect,
    pages,
  });
});

const getAllDefects = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
  const startIndex = (page - 1) * limit;
  const lastIndex = page * limit;
  const totalRecords = await Defect.countDocuments();
  const totalPages = Math.ceil(totalRecords / limit);

  if (totalRecords > 0 && page > totalPages)
    throw new CustomError("Page doesn't exist", 404);

  const defect = await Defect.find(
    {},
    "userDefectId title assignee status updatedAt"
  )
    .limit(limit)
    .skip(startIndex)
    .populate("assignee", "name email");

  const pages = {
    totalPages,
    totalRecords,
    page,
    limit,
  };

  if (lastIndex < totalRecords) {
    pages.next = {
      page: page + 1,
    };
  }
  if (startIndex > 0) {
    pages.prev = {
      page: page - 1,
    };
  }

  if (defect.length === 0) {
    return res.status(200).json({
      success: true,
      message: "No defects found",
    });
  }
  return res.status(200).json({
    success: true,
    message: "Defects are fetched successfully",
    defect,
    pages,
  });
});

const getAllAssignedToUser = asyncHandler(async (req, res) => {
  const { _id: id } = req.user;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 4;
  const startIndex = (page - 1) * limit;
  const lastIndex = page * limit;
  const totalRecords = await Defect.countDocuments({ assignee: id });
  const totalPages = Math.ceil(totalRecords / limit);

  if (totalRecords > 0 && page > totalPages)
    throw new CustomError("Page doesn't exist", 404);

  const defect = await Defect.find(
    { assignee: id },
    "userDefectId title assignee status createdAt createdBy"
  )
    .populate("assignee createdBy", "name email")
    .sort({ createdAt: -1 })
    .skip(startIndex)
    .limit(limit);

  const pages = {
    totalPages,
    totalRecords,
    page,
    limit,
  };

  if (lastIndex < totalRecords) {
    pages.next = {
      page: page + 1,
    };
  }
  if (startIndex > 0) {
    pages.prev = {
      page: page - 1,
    };
  }

  if (defect.length === 0) {
    return res.status(200).json({
      success: true,
      message: "No defects are assigned to user",
    });
  }
  return res.status(200).json({
    success: true,
    message: "Defects assigned to user are fetched successfully",
    defect,
    pages,
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
  const updatedResult = await updatedDefect.save().then(async () => {
    const updatedDefect = await Defect.findById(defectId)
      .populate("assignee", "name email")
      .populate("project", "title");
    if (!updateDefect)
      throw new CustomError("Error in updating the defect", 500);
    return res.json({
      UpdatedFields: newFields,
      success: true,
      message: `Values of ${Object.keys(
        newFields
      ).toString()} are updated successfully in defect`,
      defect: updatedDefect,
    });
  });
});

const assigneeAutocomplete = asyncHandler(async (req, res) => {
  const { key } = req.params;

  if (!key) throw new CustomError("Please enter an value to search", 401);

  const userName = await User.find(
    {
      $or: [
        { email: { $regex: key, $options: "i" } },
        { name: { $regex: key, $options: "i" } },
        // { project: { $regex: key, $options: "i" } },
      ],
    },
    "_id email name"
  ).limit(5);

  return res.status(201).json({
    success: true,
    message: "Username results fetched successfully",
    userName,
  });
});

const addComment = asyncHandler(async (req, res) => {
  const { defectId, commentId } = req.params;
  const { Comment } = req.body;
  const { _id: userId } = req.user;

  if (!defectId) throw new CustomError("Please refresh and try again", 401);
  if (!Comment) throw new CustomError("Please enter the Comment", 401);

  const defect = await Defect.findById(defectId)
    .populate("assignee createdBy", "name email")
    .populate("Comments.userId", "name email avatar");
  if (!defect) throw new CustomError("Defect not found", 404);

  if (commentId) {
    const commentIndex = defect.Comments.findIndex(
      (comment) => comment._id.toString() === commentId
    );
    if (commentIndex !== -1) {
      // if (
      //   !(userId.toString() === defect.Comments[commentIndex].userId.toString())
      // )
      //   throw new CustomError(
      //     "Not authorized to edit this comment as this was not added by you",
      //     401
      //   );
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
      )
        .populate("assignee createdBy", "name email")
        .populate("Comments.userId", "name email avatar");

      return res.status(200).json({
        success: true,
        messgae: "Comment is updated",
        defect: editedDefect,
      });
    }
  }

  const newComment = {
    userId: userId,
    Comment: Comment,
    createdAt: new Date(),
  };

  defect.Comments.push(newComment);

  defect.save().then(async () => {
    const updatedDefect = await Defect.findById(defectId)
      .populate("assignee createdBy", "name email")
      .populate("Comments.userId", "name email avatar");

    return res.status(200).json({
      success: true,
      message: "New Comment is added",
      defect: updatedDefect,
    });
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
    { $pull: { Comments: { _id: commentId } } },
    { new: true }
  );

  // , userId: userId

  if (!defect) throw new CustomError("Defect not Found", 404);
  // else if (!defect.Comments.some((comment) => comment._id.equals(commentId))) {
  //   throw new CustomError("Comment not found", 404);
  // }
  // else if (
  //   defect.Comments.some(
  //     (comment) => comment._id.equals(commentId) && comment.userId !== userId
  //   )
  // ) {
  //   throw new CustomError("User not authorized", 401);
  // }

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

  const defect = await Defect.findOne({ userDefectId: userDefectId })
    .populate("assignee createdBy", "name email")
    .populate("Comments.userId attachments.uploadedBy", "name email avatar")
    .populate("project", "title");

  if (!defect) throw new CustomError("Defect not found", 404);
  return res.status(200).json({
    success: true,
    message: "Defect details fetched successfully",
    defect,
  });
});

const updateAttachment = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { defectId } = req.params;

  const form = formidable({
    multiples: true,
    keepExtensions: true,
    maxFileSize: 5 * 1024 * 1024, // 5 MB
  });
  try {
    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, async function (err, fields, files) {
        if (err) {
          reject(new CustomError("Formidable error", 500));
        } else {
          resolve({ fields, files });
        }
      });
    });

    const defect = await Defect.findById(defectId);

    if (!defect) throw new CustomError("Defect not found", 404);

    let updatedFiles = "";
    if (typeof files === "object" && files !== null) {
      updatedFiles = Object.values(files);
    }
    updatedFiles = updatedFiles.flat();
    let fileArray = "";

    if (updatedFiles.length > 0) {
      const attachmentss = [];
      const uploadData = updatedFiles;
      for (const file of uploadData) {
        const attachment = {
          fileName: file.originalFilename,
          path: file.filepath,
          format: String(file.originalFilename).split(".").pop(),
        };
        attachmentss.push(attachment);
      }

      let fileArrayResp = Promise.all(
        attachmentss.map(async (fileKey, index) => {
          let fileData = {
            id: `${defectId}_${_id}_${fileKey.fileName}`,
            name: fileKey.fileName,
            pathName: "ProjectManagement",
            path: fileKey.path,
          };
          try {
            const result = await uploadFile(fileData);

            return {
              fileName: fileKey.fileName,
              format: fileKey.format,
              fileLink: result.secure_url,
              uploadedBy: _id,
              public_id: result.public_id,
              uploadedOn: new Date(),
            };
          } catch (err) {
            throw new CustomError(
              err.message || "Error while uploading the file",
              500
            );
          }
        })
      );

      try {
        fileArray = await fileArrayResp;
      } catch (err) {
        throw new CustomError(
          err.message || "Error occured while uploading",
          500
        );
      }
    }

    defect.attachments.push(...fileArray);
    defect.save().then(async () => {
      const updatedDefect = await Defect.findById(defectId).populate(
        "attachments.uploadedBy",
        "name avatar email"
      );

      return res.status(200).json({
        success: true,
        message: "New attachments are added",
        defect: updatedDefect,
      });
    });
  } catch (err) {
    throw new CustomError(err.message || "error while uploading the file", 500);
  }
});

const deleteAttachment = asyncHandler(async (req, res) => {
  const { defectId, attachmentId } = req.params;
  const { public_id } = req.body;

  try {
    const result = await deleteFile(public_id);
    console.log(result);
  } catch (err) {
    throw new CustomError(err.message || "Error while deleting the file", 500);
  }

  const defect = await Defect.findOneAndUpdate(
    {
      _id: defectId,
    },
    { $pull: { attachments: { _id: attachmentId } } },
    { new: true }
  ).populate("attachments.uploadedBy", "name email avatar");

  if (!defect) throw new CustomError("Defect not found", 404);

  return res.status(201).json({
    success: true,
    message: "attachment deleted successfully",
    defect,
  });
});

const searchDefect = asyncHandler(async (req, res) => {
  const { key } = req.params;
  if (!key) throw new CustomError("Please enter a value to search", 401);

  const data = await Defect.find(
    {
      $or: [
        { userDefectId: { $regex: key, $options: "i" } },
        { title: { $regex: key, $options: "i" } },
        { description: { $regex: key, $options: "i" } },
      ],
    },
    "userDefectId"
  ).limit(6);

  if (!data) throw new CustomError("No results found", 404);

  return res.status(201).json({
    success: true,
    message: "Search results fetched successfully",
    searchResult: data,
  });
});

const dashBoard = asyncHandler(async (req, res) => {
  const defects = await Defect.find(
    {},
    "userDefectId title assignee status"
  ).populate("assignee", "name email");

  return res.status(200).json({
    success: true,
    message: "Defect details fetched successfully",
    defects,
  });
});

const dashBoardStatusUpdate = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const defects = await Defect.findOneAndUpdate(
    { _id: id },
    { status: status },
    { new: true }
  );
  if (defects)
    return res.status(200).json({
      success: true,
      message: `${defects.userDefectId}'s status updated to ${defects.status}`,
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
  updateAttachment,
  deleteAttachment,
  searchDefect,
  getAllAssignedToUser,
  assigneeAutocomplete,
  getAllDefects,
  dashBoard,
  dashBoardStatusUpdate,
};

// app.get('/api/myData', async (req, res) => {
//   const filters = {};
//   for (const field in req.query) {
//     if (req.query[field]) {
//       filters[field] = { $regex: new RegExp(req.query[field], 'i') };
//     }
//   }

//   const myData = await MyModel.find(filters);

//   res.json({
//     data: myData
//   });
// });

// app.get('/api/myData', async (req, res) => {
//   try {
//     const filters = {};
//     if (req.query.name) {
//       const reg = new RegExp(req.query.name, 'i');
//       filters.name = { $regex: reg };
//     }
//     if (req.query.age) {
//       filters.age = req.query.age;
//     }

//     const myData = await MyModel.find(filters);

//     res.json({
//       data: myData
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });
