import cloudinary from "../config/couldinary.config.js";
import CustomError from "../utils/customError.js";

const uploadFile = async ({ id, name, pathName, path }) => {
  let options = {
    folder: pathName,
    public_id: id,
    resource_type: "auto",
    use_filename: true,
    unique_filename: false,
    overwrite: true,
    context: {
      caption: name,
    },
  };
  return new Promise(async (resolve, reject) => {
    try {
      const result = await cloudinary.uploader.upload(path, options);
      resolve(result);
    } catch (err) {
      console.log("file error", err);
      reject(new CustomError(err.message || "Error while uploading file", 400));
    }
  });
};

const deleteFile = async (id) => {
  try {
    const result = await cloudinary.uploader.destroy(id);
    if (result.result !== "ok") throw new CustomError("File Not found", 404);
    console.log("Delete", result);
    return result;
  } catch (err) {
    console.log("Delete Error", err);
    throw new CustomError(err.message || "Error while deleting the file", 500);
  }
};

export { uploadFile, deleteFile };
