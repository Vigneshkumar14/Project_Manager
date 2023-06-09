import axios from "axios";

export const getUser = async (user) => {
  const result = await axios.post(
    `${process.env.REACT_APP_BASE_URL}/api/login`,
    { email: user.email, password: user.password },
    {
      withCredentials: true,
    }
  );
  let data = {};
  console.log(result.data);
  if (result.data.success) {
    data = {
      email: result.data.user.email,
      id: result.data.user._id,
      message: result.data.message,
      name: result.data.user.name,
      avatar: result.data.user.avatar,
    };

    localStorage.setItem("user", JSON.stringify(data));
  }
  return data;
};

export const signOut = async () => {
  localStorage.removeItem("user");
  const result = await axios.get(
    `${process.env.REACT_APP_BASE_URL}/api/logout`,
    { withCredentials: true }
  );

  if (result.data) return result.data;
};
