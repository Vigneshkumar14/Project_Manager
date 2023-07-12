import axios from "axios";

export const createProject = async (project) => {
  try {
    const result = await axios.post(
      `${process.env.REACT_APP_BASE_URL}/api/project/create`,
      project,
      { withCredentials: true }
    );
    if (project.collaborators.length <= 0) {
      return result.data;
    }
    if (result.data.success && project.collaborators.length > 0) {
      const res = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/api/project/edit/${result.data.project._id}/addcollabarators`,
        { collaborators: project.collaborators },
        { withCredentials: true }
      );
      return res.data;
    }
  } catch (err) {
    throw Error(err.response.data.message);
  }
};

export const updateProject = async ({ _id, project, collaborators }) => {
  try {
    const result = await axios.put(
      `${process.env.REACT_APP_BASE_URL}/api/project/edit/${_id}`,

      project,
      { withCredentials: true }
    );

    if (result.data.success && collaborators?.length) {
      const res = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/api/project/edit/${_id}/addcollabarators`,
        { collaborators: collaborators },
        { withCredentials: true }
      );
      return res.data;
    }

    return result.data;
  } catch (err) {
    throw Error(err.response.data.message);
  }
};

export const getAllProject = async (page) => {
  try {
    const result = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/api/project?page=${page}`,
      { withCredentials: true }
    );
    return result.data;
  } catch (err) {
    throw Error(err.response.data.message);
  }
};

export const getProjectId = async (projectId) => {
  try {
    const result = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/api/project/${projectId}`,
      { withCredentials: true }
    );
    return result.data;
  } catch (err) {
    throw Error(err.response.data.message);
  }
};
