import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCreatedByYou } from "../store/defect/defect.home.reducer";
import { useNavigate } from "react-router-dom";
import { HiOutlineEmojiHappy } from "react-icons/hi";
import { Tooltip } from "flowbite-react";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";
import ReactPaginate from "react-paginate";

export const CreatedByYou = () => {
  const { isLoading, details } = useSelector(
    (state) => state.defectHome.createdByYou
  );

  const [pageCount, setPageCount] = useState(1);
  const [activePage, setActivePage] = useState(0);

  const currentPage = useRef();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClick = (userDefectId) => {
    navigate(`/defect/${userDefectId}`);
  };
  const handlePageClick = (e) => {
    currentPage.current = e.selected + 1;
    console.log(currentPage.current);
    dispatch(getCreatedByYou(currentPage.current));
    setActivePage(e.selected);
  };

  useEffect(() => {
    dispatch(getCreatedByYou()).then((action) => {
      if (action.payload?.defect?.pages !== undefined)
        setPageCount(action.payload.defect?.pages?.totalPages);
    });
  }, [dispatch]);

  return (
    <div className="w-full bg-[#2c2c2c] rounded py-4 mt-3">
      {isLoading ? (
        <div className="flex h-96 ">
          <div className="m-auto">
            <svg
              aria-hidden="true"
              className="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
          </div>
        </div>
      ) : (
        <div>
          {details?.length > 0 ? (
            <div>
              {details.map((defect) => {
                const options = {
                  year: "numeric",
                  month: "long",
                  day: "2-digit",
                };
                const formattedCreatedAt = new Date(
                  defect.createdAt
                ).toLocaleString("en-GB", options);

                return (
                  <div
                    className="flex flex-col bg-[#1d1d1d] rounded m-2 px-2 py-4"
                    key={defect._id}
                  >
                    <div className="flex flex-row w-full capitalize ">
                      <h1
                        className="font-semibold hover:cursor-pointer"
                        onClick={() => handleClick(defect.userDefectId)}
                      >
                        {defect.userDefectId} {" - "} {defect.title}
                      </h1>
                    </div>
                    <div className="flex flex-col capitalize w-full  items-start">
                      <Tooltip
                        content={
                          defect?.assignee?.name
                            ? defect?.assignee?.name
                            : "No Assignee"
                        }
                        placement="bottom"
                        trigger="hover"
                      >
                        <div className="flex flex-row shrink-0 w-2/4">
                          <h2 className="mr-1 shrink-0">Assigned to :</h2>
                          <h2 className="text-[#696969] shrink-0 truncate">
                            {defect?.assignee?.email
                              ? defect.assignee.email
                              : "No assignee"}
                          </h2>
                        </div>
                      </Tooltip>

                      <div className="flex flex-row shrink-0 w-2/4">
                        <h2 className="mr-1">Status : </h2>
                        <h2> {defect.status} </h2>
                      </div>
                      <div className="flex flex-row shrink-0 w-full justify-end">
                        <h2 className="mr-1">Created On : </h2>{" "}
                        <h2 className="text-[#434343]">{formattedCreatedAt}</h2>
                      </div>
                    </div>
                  </div>
                );
              })}

              <ReactPaginate
                breakLabel="..."
                nextLabel={
                  details?.pages?.next && details ? (
                    <span className="border bg-[#1d1d1d] rounded flex w-9 h-9 items-center justify-center">
                      <FiChevronRight />
                    </span>
                  ) : null
                }
                onPageChange={handlePageClick}
                pageRangeDisplayed={3}
                pageCount={pageCount}
                previousLabel={
                  details?.pages?.prev && details ? (
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
          ) : (
            <div className="flex flex-col items-center justify-center gap-y-2">
              <div>
                <h1 className="text-3xl text-center">
                  <HiOutlineEmojiHappy />
                </h1>
              </div>
              <div>
                <h1 className="px-2">You have not created any defects.</h1>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
