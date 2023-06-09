import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { logoutUser, reset } from "../store/user/user.reducer";
import { Spinner } from "./Loading.spinner";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [name, setName] = useState("User");
  const [defectExpanded, setDefectExpanded] = useState(false);
  const [userExpanded, setUserExpanded] = useState(false);
  const [hamExpanded, setHamExpanded] = useState(false);
  const { currentUser, isLoading } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const activeLink =
    "block py-2 pl-3 pr-4 text-blue-500 bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500 dark:bg-blue-600 md:dark:bg-transparent";
  const nonActiveLink =
    "block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent";
  const onLogout = async () => {
    try {
      await dispatch(logoutUser());
      await dispatch(reset());
      setIsLoggedIn(false);
      setName("");
      navigate("/logout");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (currentUser?.email) {
      setIsLoggedIn(true);
      setName(currentUser?.email);
    }
  }, [currentUser, name, isLoading, navigate, dispatch]);

  return isLoading ? (
    <Spinner />
  ) : (
    <Fragment>
      <nav className=" border-gray-200 dark:bg-gray-900 dark:border-gray-700">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <NavLink to="/login" className="flex items-center">
            <div className="w-full font-montserrat self-center font-extrabold text-transparent text-3xl md:text-4xl bg-clip-text bg-gradient-to-r from-slate-500 to-slate-600 bg-clip-text text-transparent">
              Orchestr8
            </div>
          </NavLink>
          <button
            data-collapse-toggle="navbar-dropdown"
            type="button"
            className="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-dropdown"
            aria-expanded="false"
            onClick={() => {
              setHamExpanded(!hamExpanded);
            }}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-6 h-6"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>

          <div
            className="hidden w-full md:block md:w-auto"
            id="navbar-dropdown"
          >
            <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-darkBackground md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-darkBackground dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    isActive ? activeLink : nonActiveLink
                  }
                  aria-current="page"
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    isActive ? activeLink : nonActiveLink
                  }
                >
                  Services
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    isActive ? activeLink : nonActiveLink
                  }
                >
                  Pricing
                </NavLink>
              </li>
              <li>
                <button
                  className="text-white bg-gray-800 md:bg-gray-900 hover:text-white font-medium rounded-lg text-sm text-center inline-flex items-center "
                  onClick={() => {
                    setDefectExpanded(!defectExpanded);
                    if (userExpanded) setUserExpanded(!userExpanded);
                  }}
                >
                  Defect{" "}
                  <svg
                    className="w-4 h-4 ml-2"
                    aria-hidden="true"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </button>
                {defectExpanded ? (
                  <div className="z-10 absolute bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
                    <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                      <li>
                        <a
                          href="#"
                          className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                        >
                          Defect
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                        >
                          Settings
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                        >
                          Earnings
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                        >
                          Sign out
                        </a>
                      </li>
                    </ul>
                  </div>
                ) : (
                  <></>
                )}
              </li>

              <li>
                {isLoggedIn ? (
                  <Fragment>
                    <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                      <li className="">
                        <button
                          className="block text-white bg-gray-800 md:bg-gray-900 hover:text-white font-medium rounded-lg text-sm text-center inline-flex items-center "
                          onClick={() => {
                            setUserExpanded(!userExpanded);
                            if (defectExpanded)
                              setDefectExpanded(!defectExpanded);
                          }}
                        >
                          Hello, {name}{" "}
                          <svg
                            className="w-4 h-4 ml-2"
                            aria-hidden="true"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 9l-7 7-7-7"
                            ></path>
                          </svg>
                        </button>
                        {userExpanded ? (
                          <div className="z-10 absolute bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
                            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                              <li>
                                <a
                                  href="#"
                                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                >
                                  Defect
                                </a>
                              </li>
                              <li>
                                <a
                                  href="#"
                                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                >
                                  Settings
                                </a>
                              </li>
                              <li>
                                <a
                                  href="#"
                                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                >
                                  Earnings
                                </a>
                              </li>
                              <li>
                                <button
                                  onClick={onLogout}
                                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 w-full text-left dark:hover:text-white"
                                >
                                  Logout
                                </button>
                              </li>
                            </ul>
                          </div>
                        ) : (
                          <></>
                        )}
                      </li>
                      <li></li>
                    </ul>
                  </Fragment>
                ) : (
                  <Fragment>
                    <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                      <li>
                        <NavLink
                          to="/login"
                          className={({ isActive }) =>
                            isActive ? activeLink : nonActiveLink
                          }
                        >
                          Login
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to="/register"
                          className={({ isActive }) =>
                            isActive ? activeLink : nonActiveLink
                          }
                        >
                          Register
                        </NavLink>
                      </li>
                    </ul>
                  </Fragment>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <Outlet />
    </Fragment>
  );
};
