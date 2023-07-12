import React, { useState } from "react";
import Autocomplete from "../components/Autocomplete";
import { AiOutlineClose } from "react-icons/ai";
import "../components/scrollbar.css";
import { Button } from "flowbite-react";
import { useDispatch } from "react-redux";
import { postProject } from "../store/admin/admin.reducer";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const CreateProject = () => {
  const [project, setProject] = useState({
    title: "",
    description: "",
    owner: { id: "", email: "" },
    collaborators: [],
  });

  const [owner, setOwner] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAssignee = async (userId, email) => {
    if (
      !userId &&
      !email &&
      project.owner.id === "" &&
      project.owner.email === ""
    )
      setOwner(false);

    if (
      !userId &&
      !email &&
      project.owner.id !== "" &&
      project.owner.email !== ""
    )
      setOwner(true);

    if (userId && email) {
      await setProject({ ...project, owner: { id: userId, email: email } });
      setOwner(true);
    }

    // if (project.owner.id !== "" && project.owner.email !== "")
  };

  const handleCollaborartors = (userId, email) => {
    const isDup = project.collaborators.some((obj) =>
      Object.is(obj._id, userId)
    );
    if (isDup) {
      toast.error("email already exist", {
        position: toast.POSITION.BOTTOM_RIGHT,
        className: "!bg-slate-900 !text-white",
      });
    } else {
      if (userId && email)
        setProject({
          ...project,
          collaborators: [
            ...project.collaborators,
            { _id: userId, email: email },
          ],
        });
    }
  };

  const handleCancel = () => {
    setProject({
      ...project,
      title: "",
      description: "",
      owner: { id: "", email: "" },
      collaborators: [],
    });
  };

  const handleDelete = (e, id) => {
    e.preventDefault();
    setProject({
      ...project,
      collaborators: project.collaborators.filter((item) => item._id !== id),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let projectValue = {
      ...project,
      owner: project.owner.id,
    };

    dispatch(postProject(projectValue)).then((action) => {
      if (action.payload.success)
        navigate(`/admin/project/${action.payload.project._id}`);
    });
  };

  return (
    <div className="flex flex-col justify-center items-center p-4 md:pt-16 pace-y-4">
      <div>
        <h1 className="font-bold text-lg md:text-3xl ">Create Project</h1>
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
                value={project.title}
                onChange={(e) =>
                  setProject({ ...project, title: e.target.value })
                }
              />

              <label htmlFor="projectDescription">Project Description:</label>
              <input
                id="projectDescription"
                name="projectDescription"
                className="bg-darkBackground border border-rounded rounded h-auto py-2"
                autoComplete="project-description"
                value={project.description}
                onChange={(e) =>
                  setProject({ ...project, description: e.target.value })
                }
              />

              <label>Owner:</label>
              {owner ? (
                <h1
                  className="font-bold text-lg"
                  onClick={() => setOwner(false)}
                >
                  {project.owner?.email}
                </h1>
              ) : (
                <Autocomplete change={handleAssignee} />
              )}
              <label>Collabarators:</label>
              {/* <div className="flex flex-col bg-darkSurface border border-gray-900 shadow rounded-lg h-48 overflow-y-auto"> */}
              <div>
                {project.collaborators.length > 0 && (
                  <div className="flex flex-wrap inline-flex items-center border w-full rounded-lg rounded-lg px-3 py-1 mr-2 mb-2 min-h-20 max-h-48 overflow-y-auto">
                    {project.collaborators.map((collab) => (
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
                  Create
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};
