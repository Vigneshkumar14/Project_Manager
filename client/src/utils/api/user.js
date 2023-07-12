import axios from "axios";

export const getUser = async (user) => {
  const result = await axios.post(
    `${process.env.REACT_APP_BASE_URL}/api/login`,
    { email: user.email, password: user.password },
    {
      withCredentials: true,
    }
  );

  if (result.data.success) {
    const data = {
      email: result.data.user.email,
      id: result.data.user._id,
      message: result.data.message,
      name: result.data.user.name,
      avatar: result.data.user.avatar,
      expiry: result.data.expiry,
      project: result.data.user.project,
      role: result.data.user.role,
    };

    return data;
  }
};

export const signUp = async (user) => {
  try {
    const result = await axios.post(
      `${process.env.REACT_APP_BASE_URL}/api/create`,
      user,
      { withCredentials: true }
    );

    if (result.data.success) {
      const data = {
        email: result.data.user.email,
        id: result.data.user._id,
        message: result.data.message,
        name: result.data.user.name,
        avatar: result.data.user.avatar,
        expiry: result.data.expiry,
        project: result.data.user.project,
        role: result.data.user.role,
      };

      return data;
    }
  } catch (err) {
    throw Error(err.response.data.message);
  }
};

export const signOut = async () => {
  const result = await axios.get(
    `${process.env.REACT_APP_BASE_URL}/api/logout`,
    { withCredentials: true }
  );

  if (result.data) return result.data;
};

export const authCheck = async () => {
  try {
    const result = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/api/checkauth`,
      { withCredentials: true }
    );
    if (result.data.success) {
      return result.data;
    }
  } catch (err) {
    throw new Error(err.response.data.message);
  }
};

export const changePassword = async (currentPassword, newPassword, userId) => {
  try {
    const result = await axios.put(
      `${process.env.REACT_APP_BASE_URL}/api/changepassword/${userId}`,
      { currentPassword, newPassword, userId },
      { withCredentials: true }
    );
    if (result.data.success) {
      return result.data;
    }
  } catch (err) {
    throw new Error(err.response.data.message);
  }
};

export const editUser = async (name, avatar) => {
  try {
    const result = await axios.put(
      `${process.env.REACT_APP_BASE_URL}/api/edituser`,
      { name, avatar },
      { withCredentials: true }
    );
    if (result.data.success) return result.data;
  } catch (err) {
    throw new Error(err.response.data.message);
  }
};
