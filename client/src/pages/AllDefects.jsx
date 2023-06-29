import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Spinner } from "../components/Loading.spinner";
import { getAllDefect } from "../store/defect/defect.all.reducer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Card } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";

export const AllDefects = () => {
  const { isLoading, error, pages, allDefects } = useSelector(
    (state) => state.defectAll
  );
  const [pageCount, setPageCount] = useState(1);
  const [activePage, setActivePage] = useState(0);
  const [selectedLimit, setSelectedLimit] = useState(50);
  const currentPage = useRef();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    document.title = "All defects - Orchestr8";
    if (allDefects === "") {
      dispatch(getAllDefect({ page: 1, limit: selectedLimit })).then(
        (action) => {
          setPageCount(action.payload?.pages?.totalPages);
        }
      );
    }
  }, []);

  const handleClick = (userDefectId) => {
    navigate(`/defect/${userDefectId}`);
  };

  const handlePageClick = (e) => {
    currentPage.current = e.selected + 1;
    dispatch(
      getAllDefect({ page: currentPage.current, limit: selectedLimit })
    ).then((action) => {
      setPageCount(action.payload?.pages?.totalPages);
    });
    setActivePage(e.selected);
  };

  const handlePageLimit = (e) => {
    const value = e.target.value;
    setSelectedLimit(value);

    dispatch(getAllDefect({ page: 1, limit: value })).then((action) => {
      setPageCount(action.payload?.pages?.totalPages);
    });
    setActivePage(0);
  };

  const options = {
    weekday: "short",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    timeZone: "Asia/Kolkata",
  };

  return isLoading ? (
    <Spinner />
  ) : (
    <div className="md:my-20 md:mx-10 my-5 mx-5">
      <h1 className="text-3xl mb-10 font-bold ">All Defects</h1>
      <div className="flex flex-row items-end justify-end mb-5">
        <select
          value={selectedLimit}
          onChange={handlePageLimit}
          className="bg-darkBackground float-right rounded-md border-gray-200 hove:border-none"
        >
          <option value={10} className="hover:bg-gray-900">
            10
          </option>
          <option value={25}>25</option>

          <option value={50}>50</option>
          <option value={75}>75</option>

          <option value={100}>100</option>
        </select>
      </div>

      <ReactPaginate
        breakLabel="..."
        nextLabel={
          pages?.next && allDefects ? (
            <span className="border bg-[#1d1d1d] rounded flex w-9 h-9 items-center justify-center">
              <FiChevronRight />
            </span>
          ) : null
        }
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        pageCount={pageCount}
        previousLabel={
          pages?.prev && allDefects ? (
            <span className="border bg-[#1d1d1d] rounded flex w-9 h-9 items-center justify-center">
              <FiChevronLeft />
            </span>
          ) : null
        }
        renderOnZeroPageCount={null}
        containerClassName="flex flex-row items-center justify-center space-x-2"
        pageClassName="flex items-center justify-center hover:bg-darkBackground w-6 h-6"
        activeClassName="bg-darkBackground w-9 h-9 border border-solid border-lightGrey rounded"
        forcePage={activePage}
      />
      <div className=" my-10 flex justify-center w-full">
        <div className=" max-w-full lg:grid lg:grid-cols-2 gap-4 space-y-3">
          {allDefects &&
            allDefects.map((defect) => (
              <Card
                className=" max-w-sm md:max-w-md lg:max-w-xl !bg-slate-900  hover:cursor-pointer"
                onClick={() => handleClick(defect.userDefectId)}
                key={defect._id}
              >
                <h5 className="text-2xl font-bold tracking-tight text-white">
                  <p>{defect.userDefectId}</p>
                </h5>
                <h5 className="text-lg font-bold tracking-tight text-white">
                  <p>{defect.title}</p>
                </h5>

                <p className="font-normal capitalize text-gray-400 shrink-0">
                  Assignee :{" "}
                  {defect?.assignee?.email
                    ? defect?.assignee?.email
                    : "No Assignee"}{" "}
                  ({" "}
                  {defect?.assignee?.name
                    ? defect?.assignee?.name
                    : "No Assignee"}{" "}
                  )
                </p>

                <h5 className="font-semibold capitalize tracking-tight text-white">
                  <p> Status : {defect.status}</p>
                </h5>

                <h6 className="font-light text-gray-300 float-right">
                  <p>
                    Last updated :{" "}
                    {new Date(defect.updatedAt).toLocaleDateString(
                      "en-us",
                      options
                    )}
                  </p>
                </h6>
              </Card>
            ))}
        </div>
      </div>

      <ReactPaginate
        breakLabel="..."
        nextLabel={
          pages?.next && allDefects ? (
            <span className="border bg-[#1d1d1d] rounded flex w-9 h-9 items-center justify-center">
              <FiChevronRight />
            </span>
          ) : null
        }
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        pageCount={pageCount}
        previousLabel={
          pages?.prev && allDefects ? (
            <span className="border bg-[#1d1d1d] rounded flex w-9 h-9 items-center justify-center">
              <FiChevronLeft />
            </span>
          ) : null
        }
        renderOnZeroPageCount={null}
        containerClassName="flex flex-row items-center justify-center space-x-2"
        pageClassName="flex items-center justify-center hover:bg-darkBackground w-6 h-6"
        activeClassName="bg-darkBackground w-9 h-9 border border-solid border-lightGrey rounded"
        forcePage={activePage}
      />

      <div className="flex flex-row items-end justify-end mt-5">
        <select
          value={selectedLimit}
          defaultValue={50}
          onChange={(e) => setSelectedLimit(e.target.value)}
          className="bg-darkBackground float-right rounded-md border-gray-200 hove:border-none"
        >
          <option value={10} className="hover:bg-gray-900">
            10
          </option>
          <option value={25}>25</option>

          <option value={50}>50</option>
          <option value={75}>75</option>

          <option value={100}>100</option>
        </select>
      </div>
      <ToastContainer className="max-w-sm mx-auto sm:max-w-md md:max-w-lg" />
    </div>
  );
};
