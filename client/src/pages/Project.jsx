import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Spinner } from "../components/Loading.spinner";
import { alterProject, fetchProjectWithId } from "../store/admin/admin.reducer";
import { AiFillEdit, AiOutlineClose } from "react-icons/ai";

import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Autocomplete from "../components/Autocomplete";
import { Button } from "flowbite-react";

export const Project = () => {
  const { projectId } = useParams();

  const { isLoading, projectDetails } = useSelector((state) => state.admin);

  const [edit, setEdit] = useState(false);
  // const [owner, setOwner] = useState(false);

  const [editProject, setEditProject] = useState({
    title: "",
    description: "",
    owner: { _id: "", email: "" },
  });
  const [editCollaborators, setEditCollaborators] = useState([]);

  const dispatch = useDispatch();

  const handleAssignee = (userId, email) => {
    // if (
    //   !userId &&
    //   !email &&
    //   editProject.owner._id === "" &&
    //   editProject.owner.email === ""
    // )
    //   setOwner(false);

    // if (
    //   !userId &&
    //   !email &&
    //   editProject.owner._id !== "" &&
    //   editProject.owner.email !== ""
    // )
    //   setOwner(true);

    if (userId && email) {
      setEditProject({
        ...editProject,
        owner: { _id: userId, email: email },
      });
      // setOwner(true);
    }
  };

  const handleCollaborartors = (userId, email) => {
    const isDup = editCollaborators.some((obj) => Object.is(obj._id, userId));
    if (isDup) {
      toast.error("email already exist", {
        position: toast.POSITION.BOTTOM_RIGHT,
        className: "!bg-slate-900 !text-white",
      });
    } else {
      if (userId && email)
        setEditCollaborators([
          ...editCollaborators,
          { _id: userId, email: email },
        ]);
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    setEditProject({
      ...editProject,
      title: "",
      description: "",
      owner: { _id: "", email: "" },
    });
    setEditCollaborators([]);
    setEdit(false);
  };

  const handleDelete = (e, _id) => {
    e.preventDefault();
    const updatedCollab = editCollaborators.filter((item) => item._id !== _id);
    setEditCollaborators(updatedCollab);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let proj = {
      _id: projectDetails._id,
      project: { ...editProject, owner: editProject.owner._id },
    };

    if (projectDetails.collaborators.length !== editCollaborators.length)
      proj.collaborators = editCollaborators;

    dispatch(alterProject(proj)).then(() => {
      setEdit(false);
    });
  };

  useEffect(() => {
    dispatch(fetchProjectWithId(projectId)).then((action) => {
      setEditProject({
        ...editProject,
        title: action.payload.project.title,
        description: action.payload.project.description,
        owner: action.payload.project.owner,
      });

      setEditCollaborators(action.payload.project.collaborators);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return isLoading ? (
    <Spinner />
  ) : edit ? (
    <div className="flex flex-col justify-center items-center p-4 md:pt-16 pace-y-4">
      <div>
        <h1 className="font-bold text-lg md:text-3xl ">Edit Project</h1>
      </div>
      <div className="w-full">
        <form onSubmit={handleSubmit}>
          <div className="flex justify-center md:mt-10 w-full">
            <div className="flex flex-col  md:w-2/3 md:h-3/4 lg:w-4/12 space-y-3">
              <label htmlFor="projectName">Project Name:</label>
              <input
                id="projectName"
                name="projectName"
                className="bg-darkBackground border border-rounded rounded h-auto py-2"
                autoComplete="project-name"
                value={editProject.title}
                onChange={(e) =>
                  setEditProject({ ...editProject, title: e.target.value })
                }
              />

              <label htmlFor="projectDescription">Project Description:</label>
              <input
                id="projectDescription"
                name="projectDescription"
                className="bg-darkBackground border border-rounded rounded h-auto py-2"
                autoComplete="project-description"
                value={editProject.description}
                onChange={(e) =>
                  setEditProject({
                    ...editProject,
                    description: e.target.value,
                  })
                }
              />

              <label>Owner:</label>

              <h1 className="font-bold text-lg">{editProject.owner?.email}</h1>

              <Autocomplete change={handleAssignee} />

              <label>Collabarators:</label>
              {/* <div className="flex flex-col bg-darkSurface border border-gray-900 shadow rounded-lg h-48 overflow-y-auto"> */}
              <div>
                {editCollaborators?.length > 0 && (
                  <div className="flex flex-wrap inline-flex items-center border w-full rounded-lg rounded-lg px-3 py-1 mr-2 mb-2 min-h-20 max-h-48 overflow-y-auto">
                    {editCollaborators.map((collab) => (
                      <div
                        key={collab._id}
                        className="flex flex-row border px-2 py-1 rounded-lg mx-2 my-1"
                      >
                        <span className="mr-2">{collab.email}</span>
                        <button
                          className="text-gray-600 hover:text-red-600 focus:text-red-600"
                          onClick={(e) => handleDelete(e, collab._id)}
                        >
                          <AiOutlineClose />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Autocomplete change={handleCollaborartors} />
              <div className="flex item-center justify-center gap-x-4 mt-2 py-3">
                <Button color="failure" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button color="success" type="submit">
                  Save
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  ) : (
    <div className="flex flex-col justify-center items-center p-4 md:pt-16 pace-y-4">
      <div>
        <h1 className="font-bold text-lg md:text-3xl ">Project</h1>
      </div>
      <div
        className="flex justify-end w-full px-4"
        onClick={() => {
          setEdit(true);
        }}
      >
        <AiFillEdit size={22} />
      </div>
      <div className="w-full">
        <div className="flex justify-center md:mt-10 w-full">
          <div className="flex flex-col md:w-2/3 md:h-3/4 lg:w-4/12 space-y-3">
            <div className="flex flex-row ">
              <h1 className="font-semibold text-lg">Project Name :</h1>
              <h1 className="ml-2 text-xl font-bold">{projectDetails.title}</h1>
            </div>
            <h1 className="font-semibold text-lg">Project Description :</h1>

            <div className="bg-darkBackground border border-rounded text-lg font-bold rounded h-auto py-2 px-1">
              {projectDetails.description}
            </div>

            <div className="flex flex-row ">
              <h1 className="font-semibold text-lg">Project Owner :</h1>
              <div className="flex flex-col ml-2">
                <h1 className="font-bold text-lg">
                  {projectDetails.owner?.email}
                </h1>
                <h1 className="text-center font-semibold">
                  ({projectDetails.owner?.name})
                </h1>
              </div>
            </div>

            <h1 className="font-semibold text-lg">Collabarators :</h1>
            {/* <div className="flex flex-col bg-darkSurface border border-gray-900 shadow rounded-lg h-48 overflow-y-auto"> */}
            <div>
              {projectDetails.collaborators?.length > 0 ? (
                <div className="flex flex-wrap inline-flex items-center border w-full rounded-lg rounded-lg px-3 py-1 mr-2 mb-2 min-h-20 max-h-48 overflow-y-auto">
                  {projectDetails.collaborators.map((collab) => (
                    <div
                      key={collab.id}
                      className="flex flex-row border px-2 py-1 rounded-lg mx-2 my-1"
                    >
                      <span className="mr-2">{collab.email}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap inline-flex items-center border w-full rounded-lg rounded-lg px-3 py-1 mr-2 mb-2 min-h-20 max-h-48 overflow-y-auto">
                  <span className="mr-2 font-bold text-lg">
                    {" "}
                    No Collaborators added to the project
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};
