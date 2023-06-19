import React from "react";
import { AssignedToYou } from "../components/AssignedToYou";
import { CreatedByYou } from "../components/CreatedByYou";

const Home = () => {
  document.title = "Home - Orchestr8";
  return (
    <div className="flex items-center justify-center md:my-20 md:mx-10 my-5 mx-5 ">
      <div className="flex flex-col w-full md: grid md:grid-cols-2 md:grid-rows-1  md:gap-4 gap-y-2 md:gap-y-0">
        <div className="flex flex-col px-2 py-4">
          <h1 className="md:text-2xl text-lg font-bold ">Assigned to you</h1>
          <AssignedToYou />
        </div>
        <div className="flex flex-col md:pl-2  px-2 py-4">
          <h1 className="md:text-2xl text-lg  font-bold ">Created by you</h1>
          <CreatedByYou />
        </div>
      </div>
    </div>
  );
};

export default Home;
