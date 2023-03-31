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
      reject(err);
      throw new CustomError("Error while uploading file", 500);
    }
  });
};

const deleteFile = async ({ id }) => {
  return await cloudinary.uploader.destroy(id).promise();
};

export { uploadFile, deleteFile };
