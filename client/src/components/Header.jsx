import React, { useState, useEffect, Fragment } from "react";
import { TiSortAlphabetically } from "react-icons/ti";
import { AiOutlineClose, AiOutlineDown } from "react-icons/ai";
import { VscDiffAdded } from "react-icons/vsc";
import { NavLink, Link, Outlet, useNavigate } from "react-router-dom";
import SearchBar from "./Search";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, reset } from "../store/user/user.reducer";
import { Spinner } from "./Loading.spinner";

export const Header = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [dpDown, setDpDown] = useState(false);
  const [profileDpDown, setProfileDpDown] = useState(false);

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
  }, [currentUser, isLoading]);

  const handleDropdownToggle = () => {
    setDpDown(!dpDown);
  };
  return isLoading ? (
    <Spinner />
  ) : (
    <Fragment>
      <div className="flex items-center justify-between py-2 bg-slate-900 text-gray-300 w-full px-3 md:px-5">
        <Link to="/">
          <div className="w-full font-montserrat self-center font-extrabold text-transparent text-3xl md:text-4xl bg-clip-text bg-gradient-to-r from-slate-500 to-slate-600 bg-clip-text text-transparent">
            Orchestr8
          </div>
        </Link>

        <nav>
          {/* Mobile */}
          <section className=" flex md:hidden justify-center items-center ">
            <div className="flex justity-center items-center space-x-2 ">
              <div>
                <div className="group relative w-full">
                  <img
                    src={user?.avatar && user?.avatar}
                    alt="profile"
                    className="w-10 h-10  cursor-pointer"
                    onClick={() => setProfileDpDown(!profileDpDown)}
                  />

                  <div
                    className={`absolute top-12 right-0 z-10 bg-slate-900 border text-gray-300 p-3 rounded-lg ${
                      profileDpDown ? "visible" : "invisible"
                    }`}
                  >
                    <div className="flex flex-col whitespace-pre  space-y-2 ">
                      <span className="block truncate text-sm font-medium text-gray-300 ">
                        Hello, {user?.name}
                      </span>
                      <hr className="w-full" />

                      <NavLink
                        className="text-gray-300 hover:bg-slate-700 p-2 rounded-md"
                        to="/defect/dashboard"
                      >
                        Dashboard
                      </NavLink>

                      <NavLink
                        to="/user/profile"
                        className="text-gray-300 hover:bg-slate-700 p-2 rounded-md"
                      >
                        Profile
                      </NavLink>
                      <hr className="w-full" />
                      <NavLink
                        onClick={onLogout}
                        className="text-gray-300 hover:bg-slate-700 p-2 rounded-md"
                      >
                        Logout
                      </NavLink>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="space-y-2"
                onClick={() => setIsNavOpen((prev) => !prev)}
              >
                <span className="block h-0.5 w-8  bg-gray-600"></span>
                <span className="block h-0.5 w-8  bg-gray-600"></span>
                <span className="block h-0.5 w-8  bg-gray-600"></span>
              </div>
            </div>

            <div
              className={
                isNavOpen
                  ? "block absolute w-full h-full top-0 left-0 bg-slate-900 z-10 flex flex-col justify-evenly items-center"
                  : "hidden"
              }
            >
              <div
                className=" absolute top-0 right-0 px-8 py-8"
                onClick={() => setIsNavOpen(false)} // change isNavOpen state to false to close the menu
              >
                <AiOutlineClose size={22} />
              </div>
              <ul className="flex flex-col items-center justify-between min-h-[400px]">
                <li>
                  <div className=" flex align-baseline relative">
                    <SearchBar />
                  </div>
                </li>
                <li>
                  <NavLink
                    to="/"
                    onClick={() => setIsNavOpen(false)}
                    className={({ isActive }) =>
                      isActive
                        ? "text-sky-500 underline underline-offset-4 decoration-lime-300 decoration-2"
                        : "text-gray-300"
                    }
                  >
                    Home
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/defect/dashboard"
                    onClick={() => setIsNavOpen(false)}
                    className={({ isActive }) =>
                      isActive
                        ? "text-sky-500 underline underline-offset-4  decoration-lime-300 decoration-2"
                        : "text-gray-300"
                    }
                  >
                    Dashboard
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/user/about"
                    onClick={() => setIsNavOpen(false)}
                    className={({ isActive }) =>
                      isActive
                        ? "text-sky-500 underline underline-offset-4  decoration-lime-300 decoration-2"
                        : "text-gray-300"
                    }
                  >
                    About
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/defect/create"
                    onClick={() => setIsNavOpen(false)}
                    className={({ isActive }) =>
                      isActive
                        ? "text-sky-500 underline underline-offset-4  decoration-lime-300 decoration-2"
                        : "text-gray-300"
                    }
                  >
                    Create Defect
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/defect/all"
                    onClick={() => setIsNavOpen(false)}
                    className={({ isActive }) =>
                      isActive
                        ? "text-sky-500 underline underline-offset-4  decoration-lime-300 decoration-2"
                        : "text-gray-300"
                    }
                  >
                    All Defects
                  </NavLink>
                </li>
                <li className="whitespace-pre ">
                  {isAdmin ? (
                    <NavLink
                      to="/admin/admindashboard"
                      className={({ isActive }) =>
                        isActive
                          ? "text-sky-500 overline decoration-lime-300 decoration-2"
                          : "text-gray-300"
                      }
                      onClick={() => setIsNavOpen(false)}
                    >
                      Admin Dashboard
                    </NavLink>
                  ) : null}
                </li>
              </ul>
            </div>
          </section>
          {/* Desktop */}
          <ul className=" hidden space-x-6 lg:space-x-8  md:flex text-md">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive
                    ? "text-sky-500 overline decoration-lime-300 decoration-2"
                    : "text-gray-300"
                }
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/defect/dashboard"
                className={({ isActive }) =>
                  isActive
                    ? "text-sky-500 overline decoration-lime-300 decoration-2"
                    : "text-gray-300"
                }
              >
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/user/about"
                className={({ isActive }) =>
                  isActive
                    ? "text-sky-500 overline decoration-lime-300 decoration-2"
                    : "text-gray-300"
                }
              >
                About
              </NavLink>
            </li>

            <div
              className="group relative flex flex-row items-center  w-full cursor-pointer"
              onClick={handleDropdownToggle}
            >
              Defect <AiOutlineDown size={12} className="ml-2" />
              <div
                className={`absolute top-10 left-0 bg-slate-900 border text-gray-300 p-3 rounded-lg ${
                  dpDown ? "visible" : "invisible"
                }`}
              >
                <div className="flex flex-col whitespace-pre  space-y-2 ">
                  <NavLink
                    to="/defect/create"
                    className={({ isActive }) =>
                      isActive
                        ? "flex flex-row items-center text-sky-500 hover:bg-slate-700 p-2"
                        : "text-gray-300 items-center flex flex-row hover:bg-slate-700 p-2 "
                    }
                  >
                    <VscDiffAdded size={18} />

                    <span className="flex flex-row ml-2">Create</span>
                  </NavLink>
                  <NavLink
                    to="/defect/all"
                    className={({ isActive }) =>
                      isActive
                        ? "flex flex-row items-center text-sky-500 hover:bg-slate-700 p-2"
                        : "text-gray-300 items-center flex flex-row hover:bg-slate-700 p-2"
                    }
                  >
                    <TiSortAlphabetically size={20} />

                    <span className="flex flex-row ml-2">All Defects </span>
                  </NavLink>
                </div>
              </div>
            </div>

            <li className="whitespace-pre ">
              {isAdmin ? (
                <NavLink
                  to="/admin/admindashboard"
                  className={({ isActive }) =>
                    isActive
                      ? "text-sky-500 overline decoration-lime-300 decoration-2"
                      : "text-gray-300"
                  }
                >
                  Admin Dashboard
                </NavLink>
              ) : null}
            </li>
          </ul>
        </nav>

        <div className="hidden md:flex md:justity-center md:items-center md:space-x-2 ">
          <div className="hidden md:block flex align-baseline relative mx-2">
            <SearchBar />
          </div>
          <div>
            <div
              className="group relative w-full"
              onClick={() => setProfileDpDown(!profileDpDown)}
            >
              <img
                src={user?.avatar && user?.avatar}
                alt="profile"
                className="w-10 h-10  cursor-pointer"
              />

              <div
                className={`absolute top-12 right-0 bg-slate-900 border text-gray-300 p-3 rounded-lg ${
                  profileDpDown ? "visible" : "invisible"
                }`}
              >
                <div className="flex flex-col whitespace-pre  space-y-2 ">
                  <span className="block truncate text-sm font-medium text-gray-300 ">
                    Hello, {user?.name}
                  </span>
                  <hr className="w-full" />
                  <NavLink
                    to="/defect/dashboard"
                    className="text-gray-300 hover:bg-slate-700 px-2 py-1 rounded-md"
                  >
                    Dashboard
                  </NavLink>

                  <NavLink
                    to="/user/profile"
                    className="text-gray-300 hover:bg-slate-700  px-2 py-1 rounded-md"
                  >
                    Profile
                  </NavLink>
                  <hr className="w-full" />
                  <NavLink
                    onClick={onLogout}
                    className="text-gray-300 hover:bg-slate-700  px-2 py-1 rounded-md"
                  >
                    Logout
                  </NavLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Outlet />
    </Fragment>
  );
};
