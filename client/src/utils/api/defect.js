import axios from "axios";

export const getDefect = async (defectId) => {
  try {
    const result = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/api/defect/${defectId}`,

      {
        withCredentials: true,
      }
    );

    return result.data;
  } catch (err) {
    throw Error(err.response.data.message);
  }
};

export const addNewComment = async (defectId, comment) => {
  try {
    const result = await axios.put(
      `${process.env.REACT_APP_BASE_URL}/api/defect/update/${defectId}/comment`,
      { Comment: comment },
      { withCredentials: true }
    );
    return result.data;
  } catch (err) {
    throw Error(err.response.data.message);
  }
};

export const editComment = async (defectId, comment, commentId) => {
  try {
    const result = await axios.put(
      `${process.env.REACT_APP_BASE_URL}/api/defect/update/${defectId}/comment/${commentId}`,
      { Comment: comment },
      { withCredentials: true }
    );
    return result.data;
  } catch (err) {
    throw Error(err.response.data.message);
  }
};

export const updateDefect = async (defectId, { updates }) => {
  try {
    const result = await axios.put(
      `${process.env.REACT_APP_BASE_URL}/api/defect/update/${defectId}`,
      updates,
      { withCredentials: true }
    );
    return result.data;
  } catch (err) {
    throw Error(err.response.data.message);
  }
};

export const addAttachment = async (defectId, attachment) => {
  try {
    const result = await axios.put(
      `${process.env.REACT_APP_BASE_URL}/api/defect/update/${defectId}/attachment`,
      attachment,
      {
        withCredentials: true,
      }
    );
    return result.data;
  } catch (err) {
    throw Error(err.response.data.message);
  }
};

export const removeAttachment = async (defectId, attachmentId, public_id) => {
  try {
    const result = await axios.delete(
      `${process.env.REACT_APP_BASE_URL}/api/defect/delete/${defectId}/attachment/${attachmentId}/`,
      {
        data: { public_id: public_id },

        withCredentials: true,
      }
    );
    console.log(result);
    return result.data;
  } catch (err) {
    throw Error(err.response.data.message);
  }
};

export const searchDefect = async (searchText) => {
  try {
    const abortController = new AbortController();
    const result = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/api/defect/search/${searchText}`,
      { signal: abortController.signal, withCredentials: true }
    );
    return result.data;
  } catch (err) {
    if (err.name !== "CanceledError") {
      throw Error(err.response.data.message);
    } else {
      console.log("Cancellllllllllllllllllll", err);
    }
  }
};
export const deleteExistingComment = async (commentId, defectId) => {
  try {
    const result = await axios.delete(
      `${process.env.REACT_APP_BASE_URL}/api/defect/delete/${defectId}/comment/${commentId}`,
      {
        withCredentials: true,
      }
    );

    return result.data;
  } catch (err) {
    throw Error(err.response.data.message);
  }
};

export const createNewDefect = async (values) => {
  try {
    const formData = new FormData();

    for (let key in values) {
      formData.append(key, values[key]);
    }

    if (values.attachments.length > 0) {
      values.attachments.forEach((file, index) => {
        formData.append("attachments[]", file);
      });
    }

    const result = await axios.post(
      `${process.env.REACT_APP_BASE_URL}/api/defect/create`,
      formData,
      { withCredentials: true }
    );

    return result.data;
  } catch (err) {
    console.log("first", err);
    throw Error(err.response.data.message);
  }
};
