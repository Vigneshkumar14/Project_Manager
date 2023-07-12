import React, { useEffect, useState } from "react";
import "react-quill/dist/quill.snow.css";

import { Button, Tooltip } from "flowbite-react";
import {
  AiOutlineCheck,
  AiOutlinePlus,
  AiOutlinePaperClip,
  AiOutlineDelete,
} from "react-icons/ai";
import JoditEditor from "jodit-react";

import { Comments } from "./Comments";
import {
  addComment,
  deleteAttachment,
  updateAttachments,
  updateExistingDefect,
} from "../store/defect/defect.reducer";
import { useDispatch, useSelector } from "react-redux";
import { Dropzone } from "./Dropzone";
import Autocomplete from "./Autocomplete";

export const Defect = () => {
  const [editingField, setEditingField] = useState("");
  const [values, setValues] = useState({
    name: "",
    value: "",
  });
  const [uploadFiles, setUploadFiles] = useState([]);
  const [fileChangeCount, setFileChangeCount] = useState(0);
  const dispatch = useDispatch();
  const { defect: data } = useSelector((state) => state.defect.defectDetails);

  const [textValue, setTextValue] = useState("");

  let text = ["assignee", "status", "priority"];
  let richText = ["description", "addComments"];

  const startEditing = (field, fieldValue) => {
    setEditingField(field);

    if (text.includes(field)) {
      setValues({ ...values, name: field, value: fieldValue });
    }

    if (richText.includes(field)) {
      setTextValue(fieldValue);
    }
  };

  const stopEditing = () => {
    if (text.includes(editingField)) {
      setValues({
        name: "",

        value: "",
      });
    }

    if (richText.includes(editingField)) {
      setTextValue("");
    }

    setEditingField("");
  };

  const handleFileUpload = (selectedFiles) => {
    const fileObjects = Array.from(selectedFiles).map((file) => {
      return file;
    });

    const formData = new FormData();
    if (fileObjects.length > 0) {
      fileObjects.forEach((file, index) => {
        formData.append("attachments[]", file);
      });
    }
    setUploadFiles(formData);
    setFileChangeCount(fileObjects.length);
  };

  const handleUpload = () => {
    dispatch(
      updateAttachments({ defectId: data._id, attachment: uploadFiles })
    );
  };

  const handleDeleteFile = (attachmentId, public_id) => {
    dispatch(deleteAttachment({ defectId: data._id, attachmentId, public_id }));
  };

  const handleSave = () => {
    switch (editingField) {
      case "addComments":
        dispatch(addComment({ defectId: data._id, comment: textValue }));
        stopEditing();
        break;

      case "description":
        dispatch(
          updateExistingDefect({
            defectId: data._id,
            updates: {
              description: textValue,
            },
            field: "description",
          })
        );
        stopEditing();
        break;

      default:
        dispatch(
          updateExistingDefect({
            defectId: data._id,
            updates: {
              [values.name]: values.value,
            },
            field: values.name,
          })
        );
        stopEditing();
        break;
    }

    stopEditing();
  };

  // const handleInputChange = async (event) => {
  //   const { name, value } = event.target;
  //   setValues({ ...values, name: name, value: value });
  // };

  const handleAssignee = (userId) => {
    if (userId) {
      dispatch(
        updateExistingDefect({
          defectId: data._id,
          updates: {
            assignee: userId,
          },
          field: "assignee",
        })
      );
    }
    stopEditing();
  };

  const handleSelectChange = (event) => {
    const { options, selectedIndex, name } = event.target;
    const selectedValue = options[selectedIndex].value;

    setValues({ ...values, name: name, value: selectedValue });
  };
  useEffect(() => {}, [editingField, values, dispatch]);
  return (
    <div className="flex flex-col mt-5 mx-4 md:mt-20 md:ml-10 gap-y-4">
      <div className="flex  flex-col md:flex-row ">
        <div className="md:w-4/6">
          <div className="flex flex-col md:items-start space-y-4">
            <div className=" flex-shrink-0 text-center">
              <Tooltip
                content="Defect Number"
                placement="bottom"
                className="bg-gray-300 text-gray-900"
              >
                <h1 className=" block font-bold text-2xl md:text-3xl text-blue-400">
                  {data.userDefectId}
                </h1>
              </Tooltip>
            </div>

            <div className="  max-w-full overflow-hidden whitespace-normal break-all line-clamp-2 items-center md:w-11/12 font-semibold text-xl md:text-2xl">
              <Tooltip
                content="Title"
                placement="bottom"
                className="bg-gray-300 text-gray-900"
              >
                {/* text-2xl md:text-xl lg:text-lg xl:text-base 2xl:text-md  */}
                <h1 className="text-lg md:text-2xl">{data.title}</h1>
              </Tooltip>
            </div>
          </div>

          <div className="flex flex-col text-lg mt-5 md:mt-10">
            <h1 className="font-bold text-lg">Details</h1>
            <div className="grid gap-2 gap-x-4 grid-cols-1 md:grid-cols-2 md:grid-rows-2 mt-2 md:mt-5">
              <div className="flex flex-row ">
                <p className="mr-5">Status:</p>
                <p className="">{data.status}</p>
              </div>

              <div className="flex flex-row ">
                <p className="mr-5">Priority :</p>
                <p className="">{data.prioitiy}</p>
              </div>
              <div className="flex flex-row ">
                <p className="mr-5">Project:</p>
                <p className="">{data.project}</p>
              </div>
              <div className="flex flex-row ">
                <Tooltip
                  content={data.createdBy.email}
                  placement="bottom"
                  className="bg-gray-300 text-gray-900"
                >
                  <div className="flex flex-row ">
                    <p className="mr-5">Owner:</p>
                    <p className="">{data.createdBy.name}</p>
                  </div>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>

        {/* People Container */}
        <div className="md:w-2/6 mt-5 md:mt-0 bg-darkSurface space-y-3 pb-3 px-2">
          <h1 className="md:px-5 pt-5 font-bold text-lg">People</h1>

          <div className="flex flex-row gap-4 justify-start md:justify-evenly md:p-5 md:w-full">
            {/* <div className="flex > */}
            <div>
              <h1 className="font-semibold shrink-0">Assignee :</h1>
            </div>

            {editingField === "assignee" ? (
              <Autocomplete change={handleAssignee} />
            ) : (
              <div>
                <Tooltip
                  content={
                    data?.assignee?.email
                      ? data?.assignee?.email
                      : "No Assignee"
                  }
                  placement="bottom"
                  className="bg-gray-300 text-gray-900"
                >
                  <h2
                    className="font-semibold"
                    onClick={() => setEditingField("assignee")}
                  >
                    {data?.assignee ? data?.assignee?.name : "No Assignee"}
                  </h2>
                </Tooltip>
              </div>
            )}
          </div>
          <div className="flex flex-row gap-4 justify-start md:justify-evenly md:p-5 md:w-full">
            <div>
              <h1 className="font-semibold ">Status :</h1>
            </div>
            {editingField === "status" ? (
              <div>
                <select
                  className="bg-darkBackground"
                  name="status"
                  value={values.value}
                  onChange={handleSelectChange}
                >
                  <option value="new"> New </option>
                  <option value="not started"> Not started</option>
                  <option value="in progress">In progress</option>
                  <option value="retest">Retest</option>
                  <option value="closed">Closed</option>
                  <option value="reopened">Reopened</option>
                  <option value="rejected">Rejected</option>
                </select>
                <button onClick={handleSave} className="rounded-lg ml-2">
                  <AiOutlineCheck />
                </button>
              </div>
            ) : (
              <div>
                <h2
                  className="font-semibold"
                  onClick={() => startEditing("status", data.status)}
                >
                  {data?.status}
                </h2>
              </div>
            )}
          </div>
          <div className="flex flex-row gap-4 justify-start md:justify-evenly md:p-5 md:w-full">
            <div>
              <h1 className="font-semibold ">Priority :</h1>
            </div>
            {editingField === "prioitiy" ? (
              <div>
                <select
                  className="bg-darkBackground"
                  name="prioitiy"
                  value={values.value}
                  onChange={handleSelectChange}
                >
                  <option value="low"> Low </option>
                  <option value="medium"> Medium</option>
                  <option value="high">High</option>
                </select>
                <button onClick={handleSave} className="rounded-lg ml-2">
                  <AiOutlineCheck />
                </button>
              </div>
            ) : (
              <div>
                <h2
                  className="font-semibold"
                  onClick={() => startEditing("prioitiy", data.prioitiy)}
                >
                  {data?.prioitiy}
                </h2>
              </div>
            )}
          </div>
        </div>
        {/* People Container end */}
      </div>
      <div className="md:w-4/6 gap-y-4">
        <div className="flex flex-col gap-y-2">
          <div>
            <h1 className="font-bold text-lg">Description</h1>{" "}
          </div>
          {editingField === "description" ? (
            <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-500 bg-opacity-50 z-50 max-h-screen overflow-auto">
              <div className="max-h-screen overflow-auto">
                <JoditEditor
                  className="text-black w-11/12 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  value={textValue}
                  onChange={setTextValue}
                />
                <div className="flex item-center justify-center gap-x-4 mt-2">
                  <Button color="failure" onClick={stopEditing}>
                    Cancel
                  </Button>
                  <Button color="success" onClick={handleSave}>
                    Save
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div
                className="py-4 text-md border rounded px-2"
                onClick={() => startEditing("description", data?.description)}
                dangerouslySetInnerHTML={{ __html: data?.description }}
              />
            </div>
          )}
        </div>
        {/* Attachmennts */}
        <div className="flex flex-col mt-10 gap-y-2  ">
          <div>
            <h1 className="font-bold text-lg">Attachments</h1>
          </div>
          <div>
            {data.attachments ? (
              <div>
                {data.attachments.map((file) => {
                  return (
                    <div
                      key={file._id}
                      className="flex flex-row bg-gray-700 w-full my-2 px-2 py-4 items-center justify-center justify-evenly border-2 rounded md:my-4 "
                    >
                      <div className="flex ">
                        <h1 className="text-2xl">
                          <AiOutlinePaperClip />
                        </h1>
                      </div>
                      <div>
                        <a
                          href={file.fileLink + "?dl=true"}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                        >
                          {file.fileName}
                        </a>
                      </div>
                      <div>
                        <Tooltip
                          content={file.uploadedBy.email}
                          placement="bottom"
                          className="bg-gray-300 text-gray-900"
                        >
                          <h1>uploaded by: {file.uploadedBy.name}</h1>
                        </Tooltip>
                      </div>
                      <div
                        onClick={() =>
                          handleDeleteFile(file._id, file.public_id)
                        }
                      >
                        <h1 className="text-red-600 text-lg">
                          <AiOutlineDelete />
                        </h1>
                      </div>
                    </div>
                  );
                })}
                <Dropzone onFileChange={handleFileUpload} />
                {fileChangeCount > 0 && (
                  <Button className="float-right mt-2" onClick={handleUpload}>
                    {" "}
                    Upload
                  </Button>
                )}
              </div>
            ) : (
              <div className=" flex flex-row bg-gray-700 w-full px-2 py-4 items-center space-x-2 justify-center border-2 rounded">
                <h1 className="text-2xl">
                  <AiOutlinePaperClip />
                </h1>
                <h1 className="text-center"> No attachments found</h1>
              </div>
            )}
          </div>
        </div>

        {/* Comments Start */}
        <div className="flex flex-col mt-10 gap-y-2  ">
          <div>
            <h1 className="font-bold text-lg">Comments</h1>
          </div>

          <Comments id={data._id} />
        </div>
        {/* Comments end */}

        {/* Add comments */}
        {editingField === "addComments" ? (
          <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-500 bg-opacity-50 z-50 max-h-screen overflow-auto">
            <div className="max-h-screen overflow-auto">
              <JoditEditor
                className="text-black w-11/12 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                value={textValue}
                onChange={setTextValue}
              />
              <div className="flex item-center justify-center gap-x-4 mt-2">
                <Button color="failure" onClick={stopEditing}>
                  Cancel
                </Button>
                <Button color="success" onClick={handleSave}>
                  Save
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-end mt-10 gap-x-4">
            <Button
              className=""
              onClick={() => startEditing("addComments", "")}
              pill={true}
              color="success"
            >
              Add new comment <AiOutlinePlus className="ml-2" size={19} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
