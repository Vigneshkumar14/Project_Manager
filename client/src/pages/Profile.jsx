import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Spinner } from "../components/Loading.spinner";
import { FiEdit2 } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import { changeUserPassword, updateUser } from "../store/user/user.reducer";
import { Button } from "flowbite-react";

export const Profile = () => {
  const { isLoading, currentUser, error } = useSelector((state) => state.user);
  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [editUser, setEditUser] = useState(false);
  const [user, setUser] = useState({
    fullName: "",
    avatar: currentUser.avatar,
  });

  const dispatch = useDispatch();

  const avatarValues = [
    "https://res.cloudinary.com/dingkurgz/image/upload/v1683862655/ProjectManagement/Avatar/256_1_jmvtrw.png",

    "https://res.cloudinary.com/dingkurgz/image/upload/v1683862655/ProjectManagement/Avatar/256_13_ljjdpo.png",

    "https://res.cloudinary.com/dingkurgz/image/upload/v1683862655/ProjectManagement/Avatar/256_15_vd6kdy.png",

    "https://res.cloudinary.com/dingkurgz/image/upload/v1683862654/ProjectManagement/Avatar/256_9_nz5lc2.png",

    "https://res.cloudinary.com/dingkurgz/image/upload/v1683862654/ProjectManagement/Avatar/256_12_mq8rla.png",

    "https://res.cloudinary.com/dingkurgz/image/upload/v1683862654/ProjectManagement/Avatar/256_6_jtt5xc.png",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !password.currentPassword ||
      !password.newPassword ||
      !password.confirmPassword
    )
      toast.error("Please enter all the feild to continue", {
        position: toast.POSITION.BOTTOM_RIGHT,
        className: "!bg-slate-900 !text-white",
      });

    if (password.newPassword !== password.confirmPassword) {
      toast.error("New password and confirm password doesn't match", {
        position: toast.POSITION.BOTTOM_RIGHT,
        className: "!bg-slate-900 !text-white",
      });
    }

    if (password.newPassword === password.confirmPassword)
      dispatch(
        changeUserPassword({
          currentPassword: password.currentPassword,
          newPassword: password.newPassword,
          userId: currentUser._id,
        })
      );

    setPassword({
      ...password,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleEdit = () => {
    setEditUser(!editUser);
  };

  const handleSave = () => {
    const updateFields = { name: user.fullName, avatar: user.avatar };

    if (currentUser.avatar === user.avatar) {
      updateFields.avatar = undefined;
    }

    if (currentUser.name === user.fullName && user.fullName !== "") {
      updateFields.name = undefined;
    }

    console.log(updateFields);

    dispatch(updateUser(updateFields));
    setEditUser(!editUser);
    setUser({ ...user, fullName: "" });
  };

  return isLoading ? (
    <Spinner />
  ) : (
    <div className="md:my-20 md:mx-10 my-5 mx-5">
      <h1 className="text-3xl mb-10 font-bold ">Profile</h1>

      <div className="flex justify-center w-full">
        {editUser ? (
          <div className="flex flex-col justify-center w-10/12 h-3/4 md:w-2/3 md:h-3/4 lg:w-1/3 lg:h-2/4 bg-darkSurface px-5 py-10">
            <div className="flex flex-col justify-center items-center ">
              <img src={user.avatar} alt="" className="w-2/6" />
              <h1 className="font-bold mt-2">Current Avatar</h1>

              <div className="flex grid grid-cols-3 grid-rows-2 w-full gap-4 justify-center items-center pt-10">
                {avatarValues.map((avatars) => (
                  <div
                    key={avatars}
                    className=" flex flex-col justify-center items-center"
                  >
                    <div onClick={() => setUser({ ...user, avatar: avatars })}>
                      <img src={avatars} alt="" className="" />
                    </div>
                  </div>
                ))}
              </div>
              <h1 className="mt-2 font-bold">Available Avatars</h1>

              <h1 className="w-full pt-4">
                Full Name :
                <input
                  type="text"
                  className="w-full bg-darkBackground"
                  value={user.fullName}
                  onChange={(e) =>
                    setUser({ ...user, fullName: e.target.value })
                  }
                />
              </h1>

              <div className="flex flex-col text-sm text-red-500 mt-3">
                <h1>
                  Note: Project and Roles can be changed only by Admin. Contact
                  your manager for more details.
                </h1>
                <div className="flex item-center justify-center gap-x-4 mt-2 py-3">
                  <Button color="failure" onClick={handleEdit}>
                    Cancel
                  </Button>
                  <Button color="success" onClick={handleSave}>
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col justify-center w-10/12 h-3/4 md:w-2/3 md:h-3/4 lg:w-1/3 lg:h-2/4 bg-darkSurface px-5 pb-10">
            <div className="flex flex-col justify-center items-center ">
              <div className="flex justify-end w-full py-5  ">
                <FiEdit2 className="" size={20} onClick={handleEdit} />
              </div>
              <img src={currentUser.avatar} className="rounded w-2/6" alt="" />
              <h1 className="my-3 font-bold text-sm md:text-xl capitalize">
                {currentUser.name}
              </h1>

              <hr className="bg-gray-900 w-11/12" />
            </div>
            <div className="flex justify-center items-center">
              <div className=" font-semibold mt-2 w-10/12 grid grid-cols-1 divide-y space-y-2 ">
                <h1 className="shrink-0">Full Name : {currentUser.name}</h1>
                <h1 className="shrink-0 "> Email : {currentUser.email}</h1>
                <h1 className="shrink-0 capitalize ">
                  {" "}
                  Project : {currentUser.project}
                </h1>
                <h1 className="shrink-0 ">
                  Role : {currentUser.role ? " Admin" : " User"}
                </h1>
              </div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="flex justify-center w-full">
          <div className="mt-2 space-y-2 w-full md:w-2/3 md:h-3/4 lg:w-4/12 ">
            <div>
              <h1 className="font-bold text-xl my-10">Change Password</h1>
            </div>

            <div className="flex flex-col space-y-2 ">
              <label htmlFor="currentPassword">Current Password :</label>

              <input
                id="currentPassword"
                name="currentPassword"
                type="password"
                value={password.currentPassword}
                className="bg-darkBackground rounded mt-2 "
                onChange={(e) =>
                  setPassword({ ...password, currentPassword: e.target.value })
                }
                autoComplete="current-password"
              />

              <label htmlFor="newPassword">New Password :</label>

              <input
                id="newPassword"
                name="newPassword"
                type="password"
                value={password.newPassword}
                className="bg-darkBackground rounded mt-2 "
                onChange={(e) =>
                  setPassword({ ...password, newPassword: e.target.value })
                }
                autoComplete="new-password"
              />

              <label htmlFor="confirmPassword">Confirm Password :</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={password.confirmPassword}
                className="bg-darkBackground rounded mt-2 "
                onChange={(e) =>
                  setPassword({ ...password, confirmPassword: e.target.value })
                }
                autoComplete="new-password"
              />
            </div>

            <div className="flex items-center justify-center">
              <button
                className="w-1/3 my-4 py-4 rounded bg-green-900 "
                type="submit"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </form>

      <ToastContainer className="max-w-sm mx-auto sm:max-w-md md:max-w-lg" />
    </div>
  );
};
