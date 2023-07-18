import React from "react";

import { useDrag } from "react-dnd";

export const Task = ({ task }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "TASK",
    item: task,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const handleClick = (userDefectId) => {
    window.open(`/defect/${userDefectId}`, "_blank");
  };
  return (
    <div
      className="p-2 mb-3 rounded-lg w-full border bg-gray-900 text-white"
      style={{ opacity: isDragging ? 0 : 1 }}
      ref={drag}
    >
      <div
        className="flex flex-col p-1 "
        onClick={() => handleClick(task.userDefectId)}
      >
        <p className="font-bold text-xl">{task.userDefectId}</p>
        <p className="pb-1 text-lg capitalize ">{task.title}</p>
        <hr />
        <p className="font-semibold capitalize">Status: {task.status} </p>
        <p className="text-sm">
          Assignee:{" "}
          {task?.assignee?.name ? task?.assignee?.name : "No Assignee"}
        </p>
        <p className="text-center text-sm">
          {" "}
          {task?.assignee?.email && `${task?.assignee?.email}`}
        </p>
      </div>
    </div>
  );
};
