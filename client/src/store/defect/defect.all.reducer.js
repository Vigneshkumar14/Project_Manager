import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { allDefects } from "../../utils/api/defect";
import { toast } from "react-toastify";

export const getAllDefect = createAsyncThunk(
  "defectAll/getAllDefect",
  async ({ page, limit }, thunkAPI) => {
    try {
      console.log(page, limit, "Hello");
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

const INITIAL_STATE = {
  isLoading: false,
  error: "",
  allDefects: "",
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
  },
});

export const defectAllReducer = defectAllSlice.reducer;
