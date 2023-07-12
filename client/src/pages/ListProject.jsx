import React, { useEffect, useRef, useState } from "react";
import { Spinner } from "../components/Loading.spinner";
import { useDispatch, useSelector } from "react-redux";
import { Card } from "flowbite-react";
import ReactPaginate from "react-paginate";
import { useNavigate } from "react-router-dom";
import { getProject } from "../store/admin/admin.reducer";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export const ListProject = () => {
  const { isLoading, allProjectDetails } = useSelector((state) => state.admin);
  const [pageCount, setPageCount] = useState(1);
  const [activePage, setActivePage] = useState(0);

  const currentPage = useRef();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClick = (projectId) => {
    navigate(`/admin/project/${projectId}`);
  };

  const handlePageClick = (e) => {
    currentPage.current = e.selected + 1;
    dispatch(getProject({ page: currentPage.current })).then((action) => {
      setPageCount(action.payload?.pages?.totalPages);
    });
    setActivePage(e.selected);
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

  useEffect(() => {
    document.title = "Project - Orchestr8";
    if (allProjectDetails === "") {
      dispatch(getProject({ page: 1 })).then((action) => {
        console.log(action.payload);
        setPageCount(action.payload?.pages?.totalPages);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return isLoading ? (
    <Spinner />
  ) : (
    <div className="md:my-20 md:mx-10 my-5 mx-5">
      <h1 className="text-3xl mb-10 font-bold ">Projects</h1>

      <ReactPaginate
        breakLabel="..."
        nextLabel={
          allProjectDetails.pages?.next && allProjectDetails ? (
            <span className="border bg-[#1d1d1d] rounded flex w-9 h-9 items-center justify-center">
              <FiChevronRight />
            </span>
          ) : null
        }
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        pageCount={pageCount}
        previousLabel={
          allProjectDetails.pages?.prev && allProjectDetails ? (
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
          {allProjectDetails &&
            allProjectDetails.map((project) => (
              <Card
                className=" max-w-sm md:max-w-md lg:max-w-xl !bg-slate-900  hover:cursor-pointer"
                onClick={() => handleClick(project._id)}
                key={project._id}
              >
                <h5 className="text-2xl font-bold tracking-tight text-white">
                  <p>{project.title}</p>
                </h5>
                <h5 className="text-lg font-bold tracking-tight text-white">
                  <p>{project.description}</p>
                </h5>

                <p className="font-normal capitalize text-gray-400 shrink-0">
                  Owner :{" "}
                  {project?.owner?.email
                    ? project?.owner?.email
                    : "No Assignee"}{" "}
                  ({" "}
                  {project?.owner?.name ? project?.owner?.name : "No Assignee"}{" "}
                  )
                </p>

                {/* <h5 className="font-semibold capitalize tracking-tight text-white">
                  <p> Status : {defect.status}</p>
                </h5> */}

                <h6 className="font-light text-gray-300 float-right">
                  <p>
                    Created on :{" "}
                    {new Date(project.created).toLocaleDateString(
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
          allProjectDetails.pages?.next && allProjectDetails ? (
            <span className="border bg-[#1d1d1d] rounded flex w-9 h-9 items-center justify-center">
              <FiChevronRight />
            </span>
          ) : null
        }
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        pageCount={pageCount}
        previousLabel={
          allProjectDetails.pages?.prev && allProjectDetails ? (
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
    </div>
  );
};
