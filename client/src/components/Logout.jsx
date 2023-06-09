import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

export const Logout = () => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser?.email) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  if (currentUser?.email) {
    return null;
  } else {
    return (
      <main className="grid min-h-full place-items-center justify-center bg-darkBackground px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center items-center justify-center">
          <div className="w-full font-montserrat self-center font-extrabold text-transparent text-5xl md:text-9xl bg-clip-text bg-gradient-to-r from-slate-500 to-slate-600 bg-clip-text text-transparent">
            Orchestr8
          </div>
          <div className="flex items-center justify-center">
            <svg
              width="75"
              height="75"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#D1D5DB"
              strokeWidth="2"
              strokeLinecap="square"
              strokeLinejoin="round"
            >
              <path d="M16 17l5-5-5-5M19.8 12H9M10 3H4v18h6" />
            </svg>
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-300 sm:text-5xl">
            Logout Successfull...
          </h1>
          <p className="mt-6 text-base leading-7 text-gray-300">
            You have Successfully logged out, to login again{" "}
            <Link className="text-sm font-semibold text-blue-500" to="/login">
              Click Here
            </Link>
          </p>
        </div>
      </main>
    );
  }
};
