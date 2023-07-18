import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, reset } from "../store/user/user.reducer";
import { Link, useNavigate } from "react-router-dom";
import { Spinner } from "../components/Loading.spinner";
import { RiLockPasswordLine } from "react-icons/ri";
import { AiOutlineMail, AiOutlineLogin } from "react-icons/ai";
import { BsPersonFillAdd } from "react-icons/bs";
import { ToastContainer, toast } from "react-toastify";

function LoginWrapper({ isLoading, error, isLoggedIn }) {
  const [user, setUser] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Login - Orchestr8";

    if (isLoggedIn) {
      navigate("/");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!user.email || !user.password)
      setErrorMessage("Please enter email and password");

    dispatch(loginUser(user)).then((action) => {
      if (action.payload.email) {
        dispatch(reset());
        setErrorMessage(null);
        return navigate("/");
      } else {
        setErrorMessage(action.payload);
      }
    });
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
            <form onSubmit={(e) => handleSubmit(e)}>
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
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSubmit(e);
                    }}
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
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSubmit(e);
                    }}
                    onChange={(e) =>
                      setUser({ ...user, password: e.target.value })
                    }
                    autoComplete="current-password"
                  />
                </div>
              </div>

              <div className="flex items-center mb-6 -mt-4">
                <div className="flex ml-auto">
                  <h2
                    className="inline-flex text-xs sm:text-sm text-blue-500 hover:text-blue-700"
                    onClick={(e) => {
                      e.preventDefault();
                      toast.warning(
                        "Forget password feature is currently disabled. Contact admin to reset the password",
                        {
                          position: toast.POSITION.BOTTOM_RIGHT,
                          className: "!bg-slate-900 !text-white",
                        }
                      );
                    }}
                  >
                    Forgot Your Password?
                  </h2>
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
                    <AiOutlineLogin size={20} />
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
                <BsPersonFillAdd size={24} />
              </span>
              <button className="ml-2">You don't have an account?</button>
            </Link>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

function Login() {
  const { isLoggedIn, isLoading, error } = useSelector((state) => state.user);

  return (
    <LoginWrapper isLoggedIn={isLoggedIn} isLoading={isLoading} error={error} />
  );
}

export default Login;
