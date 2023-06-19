import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { fetchDefect } from "../store/defect/defect.reducer";
import { Spinner } from "../components/Loading.spinner";
import { Defect } from "../components/Defect.component.jsx";

export const DefectPage = () => {
  const { defectId } = useParams();
  const dispatch = useDispatch();
  const location = useLocation();
  const { isLoading, defectDetails, error } = useSelector(
    (state) => state.defect
  );

  useEffect(() => {
    dispatch(fetchDefect(defectId));
    let locationName = String(location.pathname).match(/DE-\d+/i);
    let title = "";
    if (locationName) {
      title = locationName[0];
      document.title = `${title} - Orchestr8`;
    }
  }, [dispatch, defectId, location.pathname]);

  return isLoading ? (
    <Spinner />
  ) : error ? (
    <>
      <div className="flex flex-col justify-center h-screen items-center text-center">
        <h1 className="text-2xl md:text-4xl font-extrabold">Ooops..</h1>
        <h1 className="text-xl md:text-3xl font-bold">{error}</h1>
      </div>
    </>
  ) : defectDetails ? (
    <>
      {/* <h1> {JSON.stringify(defectDetails)}</h1> */}
      <Defect />
    </>
  ) : (
    <>
      <div className="flex flex-col justify-center h-screen items-center text-center">
        <h1 className="text-2xl md:text-4xl font-extrabold">Ooops..</h1>
        <h1 className="text-xl md:text-3xl font-bold">
          Not able to fetch the defect
        </h1>
      </div>
    </>
  );
};
