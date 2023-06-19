import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getUser, signOut } from "../../utils/api/user.js";

export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (user, thunkAPI) => {
    try {
      return await getUser(user);
    } catch (err) {
      const message =
        (err.response && err.response.data && err.response.data.message) ||
        err.message ||
        err.toString();
      console.log(err);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  "user/logoutUser",
  async (_, thunkAPI) => {
    try {
      return await signOut();
    } catch (err) {
      const message =
        (err.response && err.response.data && err.response.data.message) ||
        err.message ||
        err.toString();
      console.log(err);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const user = JSON.parse(localStorage.getItem("user"));
const INITIAL_STATE = {
  isLoading: false,
  currentUser: user ? user : "",
  error: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState: INITIAL_STATE,
  reducers: {
    reset(state) {
      state.isLoading = "";
      state.error = "";
    },
    resetUser(state) {
      localStorage.removeItem("user");
      state.currentUser = "";
      state.isLoading = "";
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginUser.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.currentUser = action.payload;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
    builder.addCase(logoutUser.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.isLoading = false;
      state.currentUser = "";
    });
    builder.addCase(logoutUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
  },
});

export const { reset, resetUser } = userSlice.actions;
export const userReducer = userSlice.reducer;
