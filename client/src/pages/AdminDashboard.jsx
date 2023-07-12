import { Card } from "flowbite-react";
import React from "react";
import { AiOutlineProject } from "react-icons/ai";
import { IoIosListBox } from "react-icons/io";
import { useNavigate } from "react-router-dom";

export const AdminDashboard = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col justify-center items-center space-y-4">
      <div>
        <h1 className="mt-5 md:mt-20 font-bold text-lg md:text-3xl ">
          Welcome to Admin Dashboard
        </h1>
      </div>

      <div className="md:p-10">
        <div className="flex flex-col  md:grid md:grid-cols-2 gap-4">
          <Card
            className=" max-w-sm md:max-w-md lg:max-w-xl !bg-slate-900  hover:cursor-pointer"
            onClick={() => {
              navigate("/admin/createproject");
            }}
          >
            <h5 className="flex flex-row space-x-2  items-center shrink-0 text-lg font-bold tracking-tight text-white">
              <AiOutlineProject size={22} />
              <p>Create Project</p>
            </h5>

            <p className="font-normal capitalize text-gray-400 shrink-0">
              You can create a new project and add the collaborators
            </p>
          </Card>

          <Card
            className=" max-w-sm md:max-w-md lg:max-w-xl !bg-slate-900  hover:cursor-pointer"
            onClick={() => {
              navigate("/admin/project");
            }}
          >
            <h5 className=" flex flex-row space-x-2  items-center shrink-0 text-lg font-bold tracking-tight text-white">
              <IoIosListBox size={22} />
              <p>List Projects</p>
            </h5>

            <p className="font-normal capitalize text-gray-400 shrink-0">
              You can see all the created/existing projects here and you can
              edit and delete the projects.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};
