import React from "react";

import { useDrop } from "react-dnd";
import { Task } from "./Task";
import { Dashboard } from "../pages/Dashboard";

export const Column = ({ column, change }) => {
  const [{ isOver }, drop] = useDrop({
    accept: "TASK",
    drop: (item) => {
      change(item, column);

      // dispatch(moveTask(item.id, column.id));
      // updateTaskStatusAPI(item.id, column.id); // Make the API call here
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div
      className={`flex flex-col items-center p-4 mx-4 my-2 rounded-xl  w-full text-white ${
        isOver ? "bg-gray-600" : "bg-gray-800"
      }`}
      ref={drop}
    >
      <h2 className="text-lg capitalize font-bold mb-2">{column.title}</h2>
      {column.tasks.map((task) => (
        <Task key={task._id} task={task} />
      ))}
    </div>
  );
};
