import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, reset } from "../store/user/user.reducer";
import { Link, useNavigate } from "react-router-dom";
import { Spinner } from "../components/Loading.spinner";
function Login() {
  const [user, setUser] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState(null);
  const dispatch = useDispatch();
  const { currentUser, isLoading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser !== "") {
      navigate("/");
      dispatch(reset());
      console.log("From Useeffect", currentUser);
    }

    if (error !== "") {
      setErrorMessage(error);
    }

    document.title = "Login - Orchestr8";
    // console.log("UseEffect", errorMessage);
  }, [currentUser, isLoading, error, errorMessage, dispatch, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!user.email || !user.password)
      setErrorMessage("Please enter email and password");

    dispatch(loginUser(user));
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
            Login To Your Account
          </div>

          <div className="text-center">
            <span className="px-4 text-xs text-center uppercase text-gray-300">
              Login With Email
            </span>
          </div>
          <div className="mt-10">
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col mb-6">
                <label
                  htmlFor="email"
                  className="mb-1 text-xs sm:text-sm tracking-wide text-gray-400"
                >
                  E-Mail Address:
                </label>
                <div className="relative">
                  <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
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
                  />
                </div>
              </div>
              <div className="flex flex-col mb-6">
                <label
                  htmlFor="password"
                  className="mb-1 text-xs sm:text-sm tracking-wide text-gray-400"
                >
                  Password:
                </label>
                <div className="relative">
                  <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                    <span>
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </span>
                  </div>

                  <input
                    id="password"
                    type="password"
                    name="password"
                    className="text-sm sm:text-base bg-gray-700 placeholder-gray-300 pl-10 pr-4 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-400"
                    placeholder="Password"
                    value={user.password}
                    onChange={(e) =>
                      setUser({ ...user, password: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex items-center mb-6 -mt-4">
                <div className="flex ml-auto">
                  <button className="inline-flex text-xs sm:text-sm text-blue-500 hover:text-blue-700">
                    Forgot Your Password?
                  </button>
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
                  <span className="mr-2 uppercase">Login</span>
                  <span>
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                </button>
              </div>
            </form>
          </div>
          <div className="flex justify-center items-center mt-6">
            <Link
              to="/register"
              className="inline-flex items-center font-bold text-blue-500 hover:text-blue-700 text-xs text-center"
            >
              <span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </span>
              <button className="ml-2">You don't have an account?</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
