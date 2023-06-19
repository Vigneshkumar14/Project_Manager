import { Avatar } from "flowbite-react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dropdown } from "flowbite-react";
import { Button } from "flowbite-react";
import JoditEditor from "jodit-react";
import { addComment, deleteComment } from "../store/defect/defect.reducer";

export const Comments = ({ id }) => {
  const dispatch = useDispatch();
  const Comment = useSelector(
    (state) => state.defect.defectDetails.defect.Comments
  );

  const CommentBox = ({ c }) => {
    const [editComment, setEditComment] = useState(false);
    const [textValue, setTextValue] = useState("");

    const handleEdit = (comment) => {
      setEditComment(true);
      setTextValue(comment);
    };
    const handleSave = (commentId, updatedComment) => {
      setEditComment(false);
      dispatch(
        addComment({
          defectId: id,
          comment: updatedComment,
          commentId: commentId,
        })
      );
    };
    const handleCancel = () => {
      setEditComment(false);
      setTextValue("");
    };

    const handleDelete = (commentId) => {
      dispatch(
        deleteComment({
          commentId: commentId,
          defectId: id,
        })
      );
    };

    const formattedCreatedAt = new Date(c.createdAt);
    let updatedDate = "";

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

    if (c?.modifed) {
      updatedDate = new Date(c?.lastUpdated).toLocaleString("en-US", options);
    }

    return (
      <div>
        {editComment ? (
          <div>
            <div
              key={c._id}
              className="fixed inset-0 flex flex-col items-center justify-center bg-gray-500 bg-opacity-50 z-50"
            >
              <div className="max-h-screen overflow-auto">
                <JoditEditor
                  className="text-black w-11/12 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  value={textValue}
                  onChange={setTextValue}
                />
                <div className="flex item-center justify-center gap-x-4 mt-2">
                  <Button color="failure" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button
                    color="success"
                    onClick={() => handleSave(c._id, textValue)}
                  >
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div
            key={c._id}
            className="flex flex-col my-2 border rounded px-3 py-4 my-2"
          >
            <div className="divide-y">
              <div className="flex flex-col md:flex-row justify-between ">
                <div className="flex flex-row gap-x-4 my-2">
                  <Avatar
                    img={
                      c?.userId.avatar
                        ? c?.userId.avatar
                        : "https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                    }
                    rounded={true}
                  />
                  <div className="">
                    <h1 className="semi-bold text-lg"> {c?.userId?.name} </h1>
                    <h2 className="font-thin text-sm ">{c.userId.email}</h2>
                  </div>
                </div>
                <div className="flex flex-col gap-y-2 place-content-end items-end ">
                  <Dropdown inline={true} label="">
                    <Dropdown.Item onClick={() => handleEdit(c.Comment)}>
                      Edit
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => handleDelete(c._id)}>
                      Delete
                    </Dropdown.Item>
                  </Dropdown>

                  <div className="">
                    <p className="font-extralight text-xs mb-2 content-end md:text-md ">
                      Created on:{" "}
                      {formattedCreatedAt.toLocaleString("en-US", options)}
                    </p>
                  </div>
                </div>
              </div>
              <div
                className="py-4"
                dangerouslySetInnerHTML={{ __html: c.Comment }}
              />{" "}
            </div>

            {c?.modifed && updatedDate ? (
              <div className="flex justify-end ">
                <p className="font-extralight text-xs md:text-md">
                  Last Edited on: {updatedDate}{" "}
                </p>
              </div>
            ) : (
              <></>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="">
      {Comment.map((c, index) => (
        <CommentBox key={c._id} c={c} />
      ))}
    </div>
  );
};
