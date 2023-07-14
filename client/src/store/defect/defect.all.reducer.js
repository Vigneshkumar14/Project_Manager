import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { allDefects, getDashboard } from "../../utils/api/defect";
import { toast } from "react-toastify";

export const getAllDefect = createAsyncThunk(
  "defectAll/getAllDefect",
  async ({ page, limit }, thunkAPI) => {
    try {
      const result = await allDefects(page, limit);
      return result;
    } catch (err) {
      const message =
        (err.response && err.response.data && err.response.data.message) ||
        err.message ||
        err.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getDashBoardDefects = createAsyncThunk(
  "defectAll/getDashBoardDefects",
  async (_, thunkAPI) => {
    try {
      const result = await getDashboard();
      return result;
    } catch (err) {
      const message =
        (err.response && err.response.data && err.response.data.message) ||
        err.message ||
        err.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

const INITIAL_STATE = {
  isLoading: false,
  error: "",
  allDefects: "",
  dashboard: [],
  success: "",
  pages: "",
};

const defectAllSlice = createSlice({
  name: "defectAll",
  initialState: INITIAL_STATE,
  extraReducers: (builder) => {
    builder.addCase(getAllDefect.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getAllDefect.fulfilled, (state, action) => {
      state.isLoading = false;
      state.success = action.payload.message;
      state.allDefects = action.payload.defect;
      state.pages = action.payload.pages;
      toast.success(action.payload.message, {
        position: toast.POSITION.BOTTOM_RIGHT,
        className: "!bg-slate-900 !text-white",
      });
    });
    builder.addCase(getAllDefect.rejected, (state, action) => {
      state.isLoading = false;
      state.success = "";
      state.error = action.payload;
    });
    builder.addCase(getDashBoardDefects.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getDashBoardDefects.fulfilled, (state, action) => {
      state.isLoading = false;
      const defects = action.payload.defects;

      state.dashboard = [
        {
          id: "not started",
          title: "New / Not Started",

          tasks: defects.filter((task) => task.status === "not started"),
        },
        {
          id: "in progress",
          title: "In Progress",

          tasks: defects.filter((task) => task.status === "in progress"),
        },
        {
          id: "retest",
          title: "Retest",

          tasks: defects.filter((task) => task.status === "retest"),
        },
        {
          id: "closed",
          title: "Closed",

          tasks: defects.filter((task) => task.status === "closed"),
        },
      ];
      toast.success(action.payload.message, {
        position: toast.POSITION.BOTTOM_RIGHT,
        className: "!bg-slate-900 !text-white",
      });
    });
    builder.addCase(getDashBoardDefects.rejected, (state, action) => {
      state.isLoading = false;
      state.success = "";
      state.error = action.payload;
    });
  },
});

export const defectAllReducer = defectAllSlice.reducer;
