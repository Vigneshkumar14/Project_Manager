import React, { Fragment, useEffect, useState } from "react";
import { Navbar, Dropdown, Avatar } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Link, Outlet, useNavigate } from "react-router-dom";
import { logoutUser, reset } from "../store/user/user.reducer";
import { Spinner } from "./Loading.spinner";
import SearchBar from "./Search";
import { VscDiffAdded } from "react-icons/vsc";
import { TiSortAlphabetically } from "react-icons/ti";

export const HeaderBackup = () => {
  const [user, setUser] = useState({ name: "", email: "", avatar: "" });
  const { currentUser, isLoading, isAdmin } = useSelector(
    (state) => state.user
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onLogout = async () => {
    try {
      await dispatch(logoutUser());

      await dispatch(reset());

      setUser({ ...user, name: "", email: "", avatar: "" });
      navigate("/logout");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (currentUser?.email) {
      setUser((u) => {
        return {
          ...u,
          name: currentUser?.name,
          email: currentUser?.email,
          avatar: currentUser?.avatar,
        };
      });
    }
  }, [currentUser, isLoading, navigate, dispatch]);

  return isLoading ? (
    <Spinner />
  ) : (
    <Fragment>
      <Navbar
        fluid={true}
        rounded={true}
        className="!bg-slate-900 !text-gray-300 w-full"
      >
        <Navbar.Brand to="/login" className="flex items-center">
          <div className="w-full font-montserrat self-center font-extrabold text-transparent text-3xl md:text-4xl bg-clip-text bg-gradient-to-r from-slate-500 to-slate-600 bg-clip-text text-transparent">
            Orchestr8
          </div>
        </Navbar.Brand>

        <div className="flex md:order-2 justify-center items-center">
          <div className="hidden md:block relative mx-2 ">
            <SearchBar />
          </div>
          <div className="mx-2 md:mx-4">
            <Dropdown
              arrowIcon={false}
              inline={true}
              label={
                <Avatar
                  alt="User settings"
                  img={
                    user?.avatar
                      ? user?.avatar
                      : "https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                  }
                />
              }
              className="!bg-slate-900"
            >
              <Dropdown.Header>
                <span className="block text-sm"></span>
                <span className="block truncate text-sm font-medium text-gray-300">
                  Hello, {user?.name}
                </span>
              </Dropdown.Header>
              <Dropdown.Item
                className="!text-gray-300 hover:bg-slate-700"
                onClick={() => {
                  navigate("/defect/dashboard");
                }}
              >
                Dashboard
                {/* <Link to="/defect/dashboard">Dashboard</Link> */}
              </Dropdown.Item>
              <Dropdown.Item
                className="!text-gray-300 hover:bg-slate-700"
                onClick={() => {
                  navigate("/user/profile");
                }}
              >
                Profile
                {/* <Link to="/user/profile">Profile</Link> */}
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item
                onClick={onLogout}
                className="!text-gray-300 hover:bg-slate-700"
              >
                Logout
              </Dropdown.Item>
            </Dropdown>
          </div>
          <Navbar.Toggle />
        </div>
        <Navbar.Collapse className="flex items-center justify-center text-lg  text-center">
          <Navbar.Link
            to="/"
            className={({ isActive }) =>
              isActive ? "text-blue-700" : "text-gray-300"
            }
          >
            Home
          </Navbar.Link>

          <Navbar.Link
            href="/defect/dashboard"
            className={({ isActive }) =>
              isActive ? "text-blue-700" : "text-gray-300"
            }
          >
            Dashboard
          </Navbar.Link>

          <Navbar.Link
            to="/user/about"
            className={({ isActive }) =>
              isActive ? "text-blue-700" : "text-gray-300"
            }
          >
            About
          </Navbar.Link>
          <div className="flex justify-center ">
            {" "}
            <Dropdown
              label="Defect"
              className="!bg-slate-900 items-center"
              inline={true}
            >
              <Dropdown.Item className="!text-gray-300 bg-slate-900 hover:bg-slate-700">
                <Link
                  to="/defect/create"
                  className="flex flex-row items-center"
                >
                  <VscDiffAdded size={18} />

                  <span className="ml-2">Create</span>
                </Link>
              </Dropdown.Item>
              <Dropdown.Item className="!text-gray-300 bg-slate-900 hover:bg-slate-700">
                <Link to="/defect/all" className="flex flex-row items-center ">
                  <TiSortAlphabetically size={20} />

                  <span className="ml-2">All Defects</span>
                </Link>
              </Dropdown.Item>
            </Dropdown>
          </div>

          {isAdmin ? (
            <Navbar.Link
              href="/admin/admindashboard"
              className={({ isActive }) =>
                isActive ? "text-blue-700" : "text-gray-300"
              }
            >
              Admin Dashboard
            </Navbar.Link>
          ) : null}
          {/* <Navbar.Link href="/navbars">Contact</Navbar.Link> */}
          <div className="relative md:hidden ">
            <SearchBar />
          </div>
        </Navbar.Collapse>
      </Navbar>

      <Outlet />
    </Fragment>
  );
};
