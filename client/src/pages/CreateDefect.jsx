import React from "react";
import { useSelector } from "react-redux";
import { Spinner } from "../components/Loading.spinner";
import { CreateDefectCommponent } from "../components/CreateDefect.commponent";

export const CreateDefect = () => {
  const { isLoading, error } = useSelector((state) => state.defect);

  document.title = `Create new defect - Orchestr8`;

  return isLoading ? (
    <Spinner />
  ) : error ? (
    <>
      <div className="flex flex-col justify-center h-screen items-center text-center">
        <h1 className="text-2xl md:text-4xl font-extrabold">Ooops..</h1>
        <h1 className="text-xl md:text-3xl font-bold">{error}</h1>
      </div>
    </>
  ) : (
    <CreateDefectCommponent />
  );
};
