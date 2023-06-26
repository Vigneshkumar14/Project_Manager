import React, { useState } from "react";
import { Button } from "flowbite-react";
import { AiOutlineCheck, AiOutlinePlus } from "react-icons/ai";
import JoditEditor from "jodit-react";
import { useDispatch } from "react-redux";
import { createDefect } from "../store/defect/defect.reducer";
import { Dropzone } from "./Dropzone";
import Autocomplete from "./Autocomplete";

import { useNavigate } from "react-router-dom";

export const CreateDefectCommponent = () => {
  const [editingField, setEditingField] = useState("");
  const [values, setValues] = useState({
    title: "",
    description: "",
    assignee: "",
    status: "",
    prioitiy: "",
    comments: "",
    attachments: [],
  });
  const [assignee, setAssignee] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setValues({ ...values, [name]: value });
  };

  const handleSelectChange = (event) => {
    const { options, selectedIndex, name } = event.target;
    const selectedValue = options[selectedIndex].value;

    setValues({ ...values, [name]: selectedValue });
  };

  const handleUploadFiles = (selectedFiles) => {
    const fileObjects = Array.from(selectedFiles).map((file) => {
      return file;
    });

    setValues((prevState) => ({
      ...prevState,
      attachments: fileObjects,
    }));
  };

  const handleSave = () => {
    const filteredObj = Object.fromEntries(
      Object.entries(values).filter(
        ([key, value]) => value !== "" && value !== null && value !== undefined
      )
    );

    dispatch(createDefect(filteredObj)).then((action) => {
      if (action.payload.success) {
        console.log("first Fullfilled", action.payload);
        const userDefectId = action.payload.defect.userDefectId;
        navigate(`/defect/${userDefectId}`);
      }
    });
  };

  const handleAssignee = (userId, email) => {
    if (userId) setValues({ ...values, assignee: userId });
    if (email) setAssignee(email);
    setEditingField("");
  };

  return (
    <div className="flex flex-col mt-5 mx-4 md:mt-20 md:ml-10 gap-y-4">
      <div className="flex  flex-col md:flex-row ">
        <div className="md:w-4/6">
          <div className="flex flex-col md:items-start space-y-4">
            <div className="  max-w-full flex flex-col overflow-hidden whitespace-normal break-all line-clamp-2 md:w-11/12 font-semibold text-xl md:text-2xl">
              {/* text-2xl md:text-xl lg:text-lg xl:text-base 2xl:text-md  */}
              <h1>Title</h1>
              <input
                className="text-lg md:text-2xl bg-darkBackground border-b-2 focus:outline-none mt-2"
                placeholder="Enter the title"
                onChange={handleInputChange}
                name="title"
              />
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
                        value={values.description}
                        onChange={(newContent) =>
                          setValues({ ...values, description: newContent })
                        }
                      />
                      <div className="flex item-center justify-center gap-x-4 mt-2">
                        <Button
                          color="failure"
                          onClick={() => {
                            setEditingField("");
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          color="success"
                          onClick={() => setEditingField("")}
                        >
                          Save
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    {values.description ? (
                      <div
                        className="py-4 text-md border rounded px-2"
                        onClick={() => setEditingField("description")}
                        dangerouslySetInnerHTML={{
                          __html: values?.description,
                        }}
                      />
                    ) : (
                      <div
                        className="border rounded px-2 py-10"
                        onClick={() => setEditingField("description")}
                      >
                        No description is added. Click here to add the
                        description
                      </div>
                    )}
                  </div>
                )}
              </div>
              {/* Attachments */}
              <h1 className="font-bold text-lg mt-4">Attachmets</h1>
              <div className="flex items-center mt-3 gap-x-4">
                <Dropzone onFileChange={handleUploadFiles} />
              </div>
              <h1 className="font-bold text-lg mt-4">Comments</h1>{" "}
              {/* Add comments */}
              {editingField === "addComments" ? (
                <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-500 bg-opacity-50 z-50 max-h-screen overflow-auto">
                  <div className="max-h-screen overflow-auto">
                    <JoditEditor
                      className="text-black w-11/12 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      value={values.comments}
                      onChange={(newContent) =>
                        setValues({ ...values, comments: newContent })
                      }
                    />
                    <div className="flex item-center justify-center gap-x-4 mt-2">
                      <Button
                        color="failure"
                        onClick={() => setEditingField("")}
                      >
                        Cancel
                      </Button>
                      <Button
                        color="success"
                        onClick={() => setEditingField("")}
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center mt-3 gap-x-4">
                  {values.comments ? (
                    <div
                      className="flex items-start border px-2 w-full py-4"
                      onClick={() => setEditingField("addComments")}
                    >
                      <div
                        className=""
                        dangerouslySetInnerHTML={{ __html: values?.comments }}
                      />
                    </div>
                  ) : (
                    <div>
                      <h2>
                        No comments are added yet. To add comments click the
                        button below
                      </h2>
                      <Button
                        className="float-right"
                        onClick={() => setEditingField("addComments")}
                        pill={true}
                        color="success"
                      >
                        Add new comment{" "}
                        <AiOutlinePlus className="ml-2" size={19} />
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* People Container */}
        <div className="md:w-2/6 mt-5 md:mt-0 bg-darkSurface gap-y-2 py-4 space-y-4">
          <h1 className=" pl-1 md:px-5 font-bold text-lg">People</h1>

          <div className="flex flex-row gap-4 justify-start pl-2 md:justify-evenly md:p-5 md:w-full">
            {/* <div className="flex > */}
            <div>
              <h1 className="font-semibold ">Assignee :</h1>
            </div>

            {assignee === "" ? (
              <Autocomplete change={handleAssignee} />
            ) : (
              values.assignee &&
              assignee && (
                <div>
                  <h2 className="font-semibold" onClick={() => setAssignee("")}>
                    {assignee ? assignee : "No Assignee"}
                  </h2>
                </div>
              )
            )}

            {/* <div>
              <input
                className="bg-darkBackground"
                type="text"
                name="assignee"
                onChange={handleInputChange}
              />
              <button
                onClick={(e) =>
                  setValues({ ...values, assignee: e.target.value })
                }
                className="bg-inputbg rounded-lg -m-4 pb-1"
              >
                <AiOutlineCheck />
              </button>
            </div> */}
          </div>
          <div className="flex flex-row gap-4 pl-2 justify-start md:justify-evenly md:p-5 md:w-full">
            <div>
              <h1 className="font-semibold ">Status :</h1>
            </div>

            <div>
              <select
                className="bg-darkBackground"
                name="status"
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
            </div>
          </div>
          <div className="flex flex-row gap-4 pl-2 justify-start md:justify-evenly md:p-5 md:w-full">
            <div>
              <h1 className="font-semibold ">Priority :</h1>
            </div>

            <div>
              <select
                className="bg-darkBackground"
                name="prioitiy"
                onChange={handleSelectChange}
              >
                <option value="low"> Low </option>
                <option value="medium"> Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
        </div>
        {/* People Container end */}
      </div>

      <div className="flex item-center justify-center gap-x-4 mt-2 bg-darkSurface py-3">
        <Button color="failure">Cancel</Button>
        <Button color="success" onClick={handleSave}>
          Create
        </Button>
      </div>
    </div>
  );
};
