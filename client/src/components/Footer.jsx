import React from "react";
import { Link } from "react-router-dom";
import { AiOutlineMail, AiFillLinkedin, AiFillGithub } from "react-icons/ai";
import { FiAlertTriangle } from "react-icons/fi";

export const Footer = () => {
  return (
    <footer className=" bg-gray-900 text-gray-300 py-6 text-center shrink-0 mt-6">
      <div className=" flex  flex-col justify-between space-y-4 md:space-y-0 items-center md:flex-row md:flex-row py-10">
        <div className="flex md:w-1/4 items-center justify-center">
          <h1 className="font-montserrat shrink-0 self-center font-extrabold text-transparent text-5xl md:text-4xl bg-clip-text bg-gradient-to-r from-slate-500 to-slate-600 bg-clip-text text-transparent">
            Orchestr8
          </h1>
        </div>

        <div className="flex md:w-3/4 justify-center items-center shrink-0">
          <div className="flex flex-col md:flex-row space-y-4 divide-y md:divide-none md:space-y-0 md:gap-0 w-full md:justify-evenly">
            <div className="flex justify-center md:text-start ">
              <div className="flex flex-col">
                <h1
                  className="font-semibold text-lg
                "
                >
                  Defect{" "}
                </h1>

                <Link to="/defect/all">All Defect</Link>

                <Link to="/defect/create">Create Defect</Link>
                <Link to="defect/dashboard">Dashboard </Link>
              </div>
            </div>
            <div className="flex flex-col justify-center px-3">
              <h1 className="font-semibold text-lg">My Account </h1>
              <Link to="/user/profile">Profile</Link>
              <Link to="/user/about">About Me</Link>
            </div>
            <div className="flex flex-col px-3 ">
              <h1 className="font-semibold text-lg">Contact Us </h1>
              <div className="flex flex-col  md:items-start md:justify-start">
                <a
                  className="flex flex-row items-center justify-center"
                  href="mailto: vigneshkumargu@gmail.com"
                >
                  {" "}
                  <AiOutlineMail className="mx-2" size={20} />{" "}
                  vigneshkumargu@gmail.com
                </a>

                <a
                  className="flex flex-row items-center justify-center "
                  href="https://github.com/Vigneshkumar14"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <AiFillGithub className="mx-2" size={20} />
                  Github
                </a>
                <a
                  className="flex flex-row items-center justify-center"
                  href="https://linkedin.com/in/vigneshkumar-gunasekaran"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <AiFillLinkedin className="mx-2" size={20} />
                  Linked In
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className=" flex px-2 justify-center">
        <span className="capitalize flex flex-col md:flex-row justify-center items-center ">
          <FiAlertTriangle size={24} className=" md:mr-1 text-yellow-500" />
          This application is made for educational purposes only.
        </span>
      </div>
    </footer>
  );
};
