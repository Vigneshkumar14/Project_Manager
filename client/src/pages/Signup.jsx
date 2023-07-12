import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { reset, signupUser } from "../store/user/user.reducer";
import { Link, useNavigate } from "react-router-dom";
import { Spinner } from "../components/Loading.spinner";
import { RiLockPasswordFill, RiLockPasswordLine } from "react-icons/ri";
import { AiOutlineMail } from "react-icons/ai";
import { FiUser } from "react-icons/fi";
import { HiUserAdd } from "react-icons/hi";

function Signup() {
  const [user, setUser] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  });
  const [errorMessage, setErrorMessage] = useState(null);
  const dispatch = useDispatch();
  const { isLoggedIn, isLoading } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    // if (error) {
    //   setErrorMessage(error);
    // }

    if (isLoggedIn) {
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!user.email || !user.password || !user.name || !user.confirmPassword) {
      setErrorMessage("Please enter all the details");
    }

    if (user.password === user.confirmPassword) {
      const { confirmPassword, ...userCredentials } = user;
      dispatch(signupUser(userCredentials)).then((action) => {
        if (action.payload.email) {
          dispatch(reset());
          return navigate("/");
        } else {
          setErrorMessage(action.payload);
        }
      });
    } else {
      setErrorMessage("Password and confirm password doesn't match");
    }
  };

  return isLoading ? (
    <Spinner />
  ) : (
    <div className="min-h-screen items-center justify-center text-gray-300 bg-darkBackground  ">
      <div className="w-full font-montserrat text-center mb-20 p-5 font-extrabold text-transparent text-3xl md:text-4xl bg-clip-text bg-gradient-to-r from-slate-500 to-slate-600 bg-clip-text text-transparent">
        Orchestr8
      </div>
      <div className="flex flex-col items-center justify-center ">
        <div className="flex flex-col bg-darkSurface  text-white shadow-md px-4 sm:px-6 md:px-8 lg:px-10 py-8 rounded-md w-full max-w-md">
          <div className="font-medium self-center text-center text-xl sm:text-2xl uppercase text-gray-300">
            Register as a new user
          </div>

          <div className="text-center">
            <span className="px-4 text-xs text-center uppercase text-gray-300">
              Register With Email
            </span>
          </div>
          <div className="mt-10">
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col mb-6">
                <label
                  htmlFor="name"
                  className="mb-1 text-xs sm:text-sm tracking-wide text-gray-400"
                >
                  Name:
                </label>
                <div className="relative">
                  <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                    <FiUser />
                  </div>

                  <input
                    id="name"
                    type="text"
                    name="name"
                    className="text-sm sm:text-base base bg-gray-700 placeholder-gray-300 pl-10 pr-4 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-400"
                    placeholder="Full Name"
                    value={user.name}
                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                    autoComplete="name"
                  />
                </div>
              </div>

              <div className="flex flex-col mb-6">
                <label
                  htmlFor="email"
                  className="mb-1 text-xs sm:text-sm tracking-wide text-gray-400"
                >
                  E-Mail Address:
                </label>
                <div className="relative">
                  <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                    <AiOutlineMail />
                  </div>

                  <input
                    id="email"
                    type="email"
                    name="email"
                    className="text-sm sm:text-base base bg-gray-700 placeholder-gray-300 pl-10 pr-4 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-400"
                    placeholder="E-Mail Address"
                    value={user.email}
                    onChange={(e) =>
                      setUser({ ...user, email: e.target.value })
                    }
                    autoComplete="email"
                  />
                </div>
              </div>
              <div className="flex flex-col mb-6">
                <label
                  htmlFor="current-password"
                  className="mb-1 text-xs sm:text-sm tracking-wide text-gray-400"
                >
                  Password:
                </label>
                <div className="relative">
                  <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                    <span>
                      <RiLockPasswordLine />
                    </span>
                  </div>

                  <input
                    id="current-password"
                    type="password"
                    name="current-password"
                    className="text-sm sm:text-base bg-gray-700 placeholder-gray-300 pl-10 pr-4 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-400"
                    placeholder="Password"
                    value={user.password}
                    onChange={(e) =>
                      setUser({ ...user, password: e.target.value })
                    }
                    autoComplete="current-password"
                  />
                </div>
              </div>

              <div className="flex flex-col mb-6">
                <label
                  htmlFor="confirm-password"
                  className="mb-1 text-xs sm:text-sm tracking-wide text-gray-400"
                >
                  Confirm Password:
                </label>
                <div className="relative">
                  <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                    <span>
                      <RiLockPasswordFill />
                    </span>
                  </div>

                  <input
                    id="confirm-password"
                    type="password"
                    name="confirm-password"
                    className="text-sm sm:text-base bg-gray-700 placeholder-gray-300 pl-10 pr-4 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-400"
                    placeholder="Password"
                    value={user.confirmPassword}
                    onChange={(e) =>
                      setUser({ ...user, confirmPassword: e.target.value })
                    }
                    autoComplete="current-password"
                  />
                </div>
              </div>

              {errorMessage ? (
                <h3 className="text-red-500 text-center"> {errorMessage}</h3>
              ) : null}

              <div className="flex w-full">
                <button
                  type="submit"
                  className="flex items-center justify-center focus:outline-none text-white text-sm sm:text-base bg-blue-600 hover:bg-blue-700 rounded py-2 w-full transition duration-150 ease-in"
                >
                  <span className="mr-2 uppercase">Register</span>
                  <span>
                    <HiUserAdd size={20} />
                  </span>
                </button>
              </div>
            </form>
          </div>
          <div className="flex justify-center items-center mt-6 float-right">
            <Link
              to="/login"
              className="inline-flex items-center font-bold text-blue-500 hover:text-blue-700 text-xs text-center"
            >
              <button className="ml-2">Already have an account?</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
