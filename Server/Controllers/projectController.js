import Project from "../models/projectSchema.js";
import asyncHandler from "../services/asyncHandler.js";
import CustomError from "../utils/customError.js";
import User from "../models/userSchema.js";
import mongoose from "mongoose";

const createProject = asyncHandler(async (req, res) => {
  const { title, description, owner } = req.body;

  if (!owner)
    throw new CustomError("Owner Id is not found please try again", 401);

  if (!title || !description)
    throw new CustomError("Title & Description are the mandatory fields", 401);

  const project = await Project.create({
    title,
    description,
    owner,
  });
  project.save();

  return res.status(200).json({
    success: true,
    message: "New Project created successfully",
    project,
  });
});

const updateProject = asyncHandler(async (req, res) => {
  const { _id: userId, role } = req.user;
  const { projectId } = req.params;
  const { ...data } = req.body;

  const project = await Project.findOne({ _id: projectId });
  if (!project) throw new CustomError("Project not found", 404);

  if (!(role === 1 || project.owner.toString() === userId.toString()))
    throw new CustomError("Not Autherized to edit the Project", 401);

  const newFields = {};
  Object.keys(data).forEach((key) => {
    if (project[key] !== undefined) {
      newFields[key] = data[key];
    }
  });

  const updatedProject = Object.assign(project, newFields);

  const updatedResult = await updatedProject.save();

  const uProject = await Project.findById(projectId).populate(
    "collaborators owner",
    "email name"
  );

  return res.status(200).json({
    success: true,
    message: "Project updated successfully",
    project: uProject,
  });
});

const addCollaborators = asyncHandler(async (req, res) => {
  const { _id: userId, role } = req.user;
  const { projectId } = req.params;
  const { collaborators } = req.body;

  // const users = collaborators.map((user) => user.email);
  // .split(",");

  if (!collaborators)
    throw new CustomError("Please enter the collabrator's IDs");

  const project = await Project.findById(projectId);
  if (!(project.owner.toString() === userId.toString() || role == 1))
    throw new CustomError("Not Autherized to edit the Project", 401);

  // const userExtract = await User.find({ email: { $in: users } }, "_id email");

  // const existingEmail = collaborators.map((user) => user.email);

  // const nonExistingEmails = users.filter((email) => {
  //   return !existingEmail.includes(email.trim());
  // });

  // if (nonExistingEmails.length > 0)
  //   throw new CustomError(
  //     `These email ID's ${nonExistingEmails.toString()} doesn't exist`,
  //     404
  //   );

  const userIds = collaborators.map((user) => user._id);
  // .toString()

  const addUsers = await project.addCollaborators(userIds);

  const uProject = await Project.findById(projectId).populate(
    "collaborators owner",
    "email name"
  );

  return res.status(200).json({
    success: true,
    message: "Collaberators are added",
    project: uProject,
  });
});

const deleteProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const project = await Project.findByIdAndDelete(projectId);

  if (!project) throw new CustomError("project not found", 404);

  return res.status(200).json({
    success: true,
    message: "Project deleted successfully",
  });
});

const getProjectWithId = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(projectId))
    throw new CustomError("Invalid project ID", 401);

  const project = await Project.findOne({ _id: projectId }).populate(
    "collaborators owner",
    "email name"
  );
  if (!project)
    throw new CustomError("Project ID requested doesn't exist", 404);

  return res.status(200).json({
    success: true,
    message: "Project Details are fetched",
    project,
  });
});

const getAllProject = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 25;
  const startIndex = (page - 1) * limit;
  const lastIndex = page * limit;
  const totalRecords = await Project.countDocuments();
  const totalPages = Math.ceil(totalRecords / limit);

  if (page > totalPages) throw new CustomError("Page doesn't exist", 404);

  const project = await Project.find()
    .populate("owner collaborators", "email name")
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

  return res.status(200).json({
    success: true,

    project,
    pages,
  });
});

const getProjectNames = asyncHandler(async (_, res) => {
  const project = await Project.find({}, "title");
  if (!project) throw new CustomError("No Projects found", 404);
  return res.status(200).json({
    success: true,
    message: "Fetched Project titles with id",
    project,
  });
});
export {
  createProject,
  updateProject,
  addCollaborators,
  deleteProject,
  getProjectWithId,
  getAllProject,
  getProjectNames,
};
