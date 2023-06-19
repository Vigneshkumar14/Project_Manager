import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { assignedToYou, createdByYou } from "../../utils/api/defect";

const INITIAL_STATE = {
  assignedToYou: {
    isLoading: false,
    error: "",
    details: [],
    success: "",
  },

  createdByYou: {
    isLoading: false,
    error: "",
    details: [],
    success: "",
  },
};

export const getAssignedToYou = createAsyncThunk(
  "defectHome/getAssignedToYou",
  async (page, thunkAPI) => {
    try {
      const result = await assignedToYou(page);
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

export const getCreatedByYou = createAsyncThunk(
  "defectHome/getCreatedByYou",
  async (page, thunkAPI) => {
    try {
      const result = await createdByYou(page);
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

const defectHomeSlice = createSlice({
  name: "defectHome",
  initialState: INITIAL_STATE,
  reducers: {
    reset(state) {
      state.assignedToYou.isLoading = false;
      state.assignedToYou.error = false;

      state.createdByYou.isLoading = false;
      state.createdByYou.error = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAssignedToYou.pending, (state) => {
      state.assignedToYou.isLoading = true;
    });
    builder.addCase(getAssignedToYou.fulfilled, (state, action) => {
      state.assignedToYou.isLoading = false;
      state.assignedToYou.details = action.payload.defect;
      if (action.payload.pages !== undefined)
        state.assignedToYou.details.pages = action.payload.pages;
      state.assignedToYou.success = action.payload.message;
    });
    builder.addCase(getAssignedToYou.rejected, (state, action) => {
      state.assignedToYou.isLoading = false;
      state.assignedToYou.error = action.payload;
    });
    builder.addCase(getCreatedByYou.pending, (state) => {
      state.createdByYou.isLoading = true;
    });
    builder.addCase(getCreatedByYou.fulfilled, (state, action) => {
      state.createdByYou.isLoading = false;
      state.createdByYou.details = action.payload.defect;
      if (action.payload.pages !== undefined)
        state.createdByYou.details.pages = action.payload.pages;
      state.createdByYou.success = action.payload.message;
    });
    builder.addCase(getCreatedByYou.rejected, (state, action) => {
      state.createdByYou.isLoading = false;
      state.createdByYou.error = action.payload;
    });
  },
});

export const { reset } = defectHomeSlice.actions;
export const defectHomeReducer = defectHomeSlice.reducer;
