import React, { useState } from "react";

import { AiOutlineMail, AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";

export const About = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(!open);
  };
  return (
    <div className=" flex justify-center px-4 py-10">
      <div className="flex flex-col justify-center items-center md:w-2/4 font-mono ">
        <div className="flex flex-col md:flex-row w-full h-full">
          <div className="flex md:w-1/2  justify-center items-center  ">
            <img
              src="https://res.cloudinary.com/dingkurgz/image/upload/v1689685591/ProjectManagement/Profile/My_Image_jzltvy.jpg"
              alt=""
              className="h-4/5 md:h-fit border border-gray-400 rounded-lg p-2"
            />
          </div>
          <div className=" flex flex-col md:w-1/2 justify-center items-center px-2 ">
            <h1 className="font-bold text-2xl italic">Vigneshkumar</h1>
            <h1 className="font-semibold text-lg italic text-center">
              B.Tech (Software Engineering) - 2021
            </h1>
            <h1 className="font-semibold text-lg">Full Stack Developer</h1>
            {!open && (
              <div className="">
                <hr />
                <h1 className="mt-2 text-center text-gray-400 font-semibold text-lg">
                  SAP BODS developer turned MERN full stack enthusiast with 20
                  months of experience. Currently seeking new opportunities to
                  leverage my skills and contribute to exciting projects
                </h1>
              </div>
            )}
          </div>
        </div>
        <hr className="w-full h-2 mt-2" />
        {open && (
          <div
            className="flex flex-row items-center justify-end cursor-pointer"
            onClick={handleOpen}
          >
            <h1>Show Less</h1>
            <AiOutlineMinus
              className="flex justify-center items-center mx-2"
              size={20}
            />{" "}
          </div>
        )}

        {open ? (
          <div className="flex flex-col flex-grow align-center justify-center container bg-darkSurface py-3 px-4">
            <p className="italic mt-4 animate-fade-in-out">
              I am a passionate and dedicated software professional with 20
              months of working experience as a SAP BODS developer. I hold a
              B.tech degree in Software Engineering, which I obtained in 2021.
            </p>

            <p className="italic py-4">
              During my career, I have developed a strong foundation in data
              integration and transformation using SAP BODS. I have successfully
              delivered projects, working closely with clients to understand
              their requirements and provide effective solutions.
            </p>

            <p className="italic py-4">
              {" "}
              However, my curiosity and eagerness to expand my skill set have
              led me to venture into the world of full stack development.{" "}
            </p>
            <p className="font-bold italic text-lg py-4 text-gray-400">
              Currently, I am seeking new opportunities as a MERN (MongoDB,
              Express, React, Node) full stack developer. In pursuit of my
              passion for software development, I have also created a project
              management application using the MERN stack. This application
              incorporates technologies such as React, Redux, MongoDB, Express,
              and Node, providing a robust and efficient platform for managing
              projects and tasks.{" "}
            </p>

            <p className="font-semibold italic ">
              I am excited to bring my expertise in full stack development to
              contribute to innovative projects. I thrive in collaborative
              environments and enjoy working with diverse teams to deliver
              high-quality software solutions. If you are interested in
              discussing potential opportunities or have any questions, please
              feel free to reach out to me. I look forward to connecting with
              you.
            </p>

            <span className="flex flex-row justify-center pt-16 ">
              Contact :{" "}
              <a
                className="flex flex-row items-center "
                href="mailto: vigneshkumargu@gmail.com"
              >
                vigneshkumargu@gmail.com <AiOutlineMail className="mx-2" />
              </a>
            </span>
            <div
              className="flex flex-row  items-center justify-end cursor-pointer"
              onClick={handleOpen}
            >
              <h1>Show Less</h1>
              <AiOutlineMinus
                className="flex justify-center items-center mx-2"
                size={20}
              />{" "}
            </div>
          </div>
        ) : (
          <div
            className="flex flex-row items-center cursor-pointer px-4 py-2 border border-lime-400"
            onClick={handleOpen}
          >
            <h1>Show More</h1> <AiOutlinePlus className="mx-2" size={20} />
          </div>
        )}
      </div>
    </div>
  );
};
