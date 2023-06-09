import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Spinner } from "../components/Loading.spinner";
import { CreateDefect_commponent } from "../components/CreateDefect.commponent";

export const CreateDefect = () => {
  const dispatch = useDispatch();
  const { isLoading, defectDetails, error } = useSelector(
    (state) => state.defect
  );
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
    <CreateDefect_commponent />
  );
};
