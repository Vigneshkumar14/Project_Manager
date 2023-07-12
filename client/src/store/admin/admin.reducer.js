import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createProject,
  getAllProject,
  getProjectId,
  updateProject,
} from "../../utils/api/admin";

import { toast } from "react-toastify";

const INITIAL_STATE = {
  isLoading: false,
  allProjectDetails: "",
  projectDetails: "",
};

export const fetchProjectWithId = createAsyncThunk(
  "admin/fetchProjectWithId",
  async (projectId, thunkAPI) => {
    try {
      const result = await getProjectId(projectId);
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

export const getProject = createAsyncThunk(
  "admin/getProject",
  async (page, thunkAPI) => {
    try {
      const result = await getAllProject(page);
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

export const alterProject = createAsyncThunk(
  "admin/editProject",
  async (proj, thunkAPI) => {
    try {
      const result = await updateProject(proj);
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

export const postProject = createAsyncThunk(
  "admin/postProject",
  async (projectValue, thunkAPI) => {
    try {
      const result = await createProject(projectValue);
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

const adminSlice = createSlice({
  name: "admin",
  initialState: INITIAL_STATE,
  extraReducers: (builder) => {
    builder.addCase(postProject.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(postProject.fulfilled, (state, action) => {
      state.isLoading = false;
      if (action.payload.success)
        toast.success("Project created successfully", {
          position: toast.POSITION.BOTTOM_RIGHT,
          className: "!bg-slate-900 !text-white",
        });
    });
    builder.addCase(postProject.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      toast.error(action.payload, {
        position: toast.POSITION.BOTTOM_RIGHT,
        className: "!bg-slate-900 !text-white",
      });
    });
    builder.addCase(getProject.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getProject.fulfilled, (state, action) => {
      state.isLoading = false;
      state.allProjectDetails = action.payload.project;
      state.allProjectDetails.pages = action.payload.pages;
      if (action.payload.success)
        toast.success(action.payload.message, {
          position: toast.POSITION.BOTTOM_RIGHT,
          className: "!bg-slate-900 !text-white",
        });
    });
    builder.addCase(getProject.rejected, (state, action) => {
      state.isLoading = false;
      toast.error(action.payload, {
        position: toast.POSITION.BOTTOM_RIGHT,
        className: "!bg-slate-900 !text-white",
      });
    });
    builder.addCase(fetchProjectWithId.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchProjectWithId.fulfilled, (state, action) => {
      state.isLoading = false;
      state.projectDetails = action.payload.project;
      if (action.payload.success)
        toast.success(action.payload.message, {
          position: toast.POSITION.BOTTOM_RIGHT,
          className: "!bg-slate-900 !text-white",
        });
    });
    builder.addCase(fetchProjectWithId.rejected, (state, action) => {
      state.isLoading = false;
      toast.error(action.payload, {
        position: toast.POSITION.BOTTOM_RIGHT,
        className: "!bg-slate-900 !text-white",
      });
    });
    builder.addCase(alterProject.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(alterProject.fulfilled, (state, action) => {
      state.isLoading = false;
      state.projectDetails = action.payload.project;
      toast.success(action.payload.message, {
        position: toast.POSITION.BOTTOM_RIGHT,
        className: "!bg-slate-900 !text-white",
      });
    });
    builder.addCase(alterProject.rejected, (state, action) => {
      state.isLoading = false;
      toast.error(action.payload.message, {
        position: toast.POSITION.BOTTOM_RIGHT,
        className: "!bg-slate-900 !text-white",
      });
    });
  },
});

export const adminReducer = adminSlice.reducer;
