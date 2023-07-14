import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Column } from "../components/Column";
import { getDashBoardDefects } from "../store/defect/defect.all.reducer";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Spinner } from "../components/Loading.spinner";
import { ToastContainer, toast } from "react-toastify";
import { updateStatus } from "../utils/api/defect";

export const Dashboard = () => {
  const { isLoading, dashboard } = useSelector((state) => state.defectAll);
  const dispatch = useDispatch();
  const [columns, setColumns] = useState(dashboard);

  useEffect(() => {
    document.title = "Dashboard - Orchestr8";

    dispatch(getDashBoardDefects());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setColumns(dashboard);
  }, [dashboard]);

  const changeStatus = (item, col) => {
    if (!(item.status === col.id)) {
      setColumns((prevColumns) => {
        const updatedColumns = prevColumns.map((column) => {
          if (column.id === item.status) {
            return {
              ...column,
              tasks: column.tasks.filter((task) => task._id !== item._id),
            };
          }
          return column;
        });
        return updatedColumns;
      });

      setColumns((prevColumns) => {
        const updatedColumns = prevColumns.map((column) => {
          if (column.id === col.id) {
            return {
              ...column,
              tasks: [...column.tasks, { ...item, status: col.id }],
            };
          }
          return column;
        });
        return updatedColumns;
      });

      updateAPI(item._id, col.id);
    }
  };

  const updateAPI = async (id, status) => {
    try {
      const result = await updateStatus(id, status);
      console.log("first", result);
      if (result.success) {
        toast.success(result.message, {
          position: toast.POSITION.BOTTOM_RIGHT,
          className: "!bg-slate-900 !text-white",
        });
      }
    } catch (err) {
      const message =
        (err.response && err.response.data && err.response.data.message) ||
        err.message ||
        err.toString();
      toast.error(message, {
        position: toast.POSITION.BOTTOM_RIGHT,
        className: "!bg-slate-900 !text-white",
      });
    }
  };

  return isLoading ? (
    <Spinner />
  ) : (
    <DndProvider backend={HTML5Backend}>
      <h1 className="flex justify-center text-3xl font-semibold pt-5">
        Dashboard
      </h1>

      <div className="flex justify-center py-8">
        {columns.map((column) => (
          <Column key={column.id} column={column} change={changeStatus} />
        ))}
      </div>
      <ToastContainer />
    </DndProvider>
  );
};
