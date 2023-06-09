import React, { useState } from "react";
import {
  AiOutlineClose,
  AiOutlineCloudUpload,
  AiOutlinePaperClip,
} from "react-icons/ai";

export const Dropzone = ({ onFileChange }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileChange = (event) => {
    const files = event.target.files;
    const fileList = Array.from(files);
    setSelectedFiles(fileList);
    onFileChange(fileList);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleRemove = (file) => {
    const updatedList = selectedFiles.filter((f) => f !== file);
    setSelectedFiles(updatedList);
    onFileChange(updatedList);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    const fileList = Array.from(files);
    setSelectedFiles(fileList);
    onFileChange(fileList);
  };

  return (
    <div className="w-full" onDragOver={handleDragOver} onDrop={handleDrop}>
      <div className="border-2 border-gray-300 bg-slate-700 py-2 md:py-6 ">
        <label className="cursor-pointer">
          <input
            type="file"
            className="hidden"
            name="attachemnts"
            onChange={handleFileChange}
            multiple
          />
          <div className="flex  flex-col p-4 text-center items-center justify-center">
            <div>
              <h1 className="text-5xl ">
                <AiOutlineCloudUpload />
              </h1>
            </div>

            <p className="text-gray-300">
              Drag and drop files here or click to select
            </p>
          </div>
        </label>
      </div>

      {selectedFiles.length > 0 && (
        <div className="mt-4">
          <p className="text-md font-bold text-gray-300 mb-2">
            Selected Files:
          </p>
          <ul className="list-inside">
            {selectedFiles.map((file, index) => (
              <div
                className="flex flex-row items-center justify-center justify-between border-2 mb-2 bg-gray-700 p-3"
                key={index}
              >
                <h1 className="text-xl">
                  <AiOutlinePaperClip />
                </h1>

                <li className="">{file.name}</li>

                <h1
                  className="text-lg text-red-600 font-extrabold"
                  onClick={() => handleRemove(file)}
                >
                  <AiOutlineClose />
                </h1>
              </div>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
