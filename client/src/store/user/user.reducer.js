import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  authCheck,
  changePassword,
  editUser,
  getUser,
  signOut,
  signUp,
} from "../../utils/api/user.js";
import { toast } from "react-toastify";

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

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const checkAuth = createAsyncThunk(
  "user/checkAuth",
  async (_, thunkAPI) => {
    try {
      return await authCheck();
    } catch (err) {
      const message =
        (err.response && err.response.data && err.response.data.message) ||
        err.message ||
        err.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const changeUserPassword = createAsyncThunk(
  "user/changeUserPassword",
  async ({ currentPassword, newPassword, userId }, thunkAPI) => {
    try {
      return await changePassword(currentPassword, newPassword, userId);
    } catch (err) {
      const message =
        (err.response && err.response.data && err.response.data.message) ||
        err.message ||
        err.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const signupUser = createAsyncThunk(
  "user/signupUser",
  async (user, thunkAPI) => {
    try {
      return await signUp(user);
    } catch (err) {
      const message =
        (err.response && err.response.data && err.response.data.message) ||
        err.message ||
        err.toString();

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

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateUser = createAsyncThunk(
  "user/updateUser",
  async ({ name, avatar }, thunkAPI) => {
    try {
      console.log(name, avatar);
      return await editUser(name, avatar);
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
  currentUser: "",
  error: "",
  isLoggedIn: false,
  isAdmin: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState: INITIAL_STATE,
  reducers: {
    reset(state) {
      state.isLoading = false;
      state.error = "";
    },
    resetUser(state) {
      // localStorage.removeItem("user");
      state.currentUser = "";
      state.isLoading = false;
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
      if (action.payload.role === 1) state.isAdmin = true;
      state.isLoggedIn = true;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.isLoggedIn = false;
      state.isAdmin = false;
    });
    builder.addCase(signupUser.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(signupUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.currentUser = action.payload;
      if (action.payload.role === 1) state.isAdmin = true;
      state.isLoggedIn = true;
    });
    builder.addCase(signupUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.isLoggedIn = false;
      state.isAdmin = false;
    });
    builder.addCase(logoutUser.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.isLoading = false;
      state.isLoggedIn = false;
      state.currentUser = "";
      state.isLoggedIn = false;
    });
    builder.addCase(logoutUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.isLoggedIn = false;
      state.isAdmin = false;
    });
    builder.addCase(checkAuth.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(checkAuth.fulfilled, (state, action) => {
      state.isLoading = false;
      state.currentUser = action.payload.user;
      if (action.payload.success) {
        if (action.payload.user.role === 1) {
          state.isAdmin = true;
        } else {
          state.isAdmin = false;
        }
      }
      state.isLoggedIn = true;
    });
    builder.addCase(checkAuth.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.isLoggedIn = false;
      state.isAdmin = false;
    });
    builder.addCase(changeUserPassword.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(changeUserPassword.fulfilled, (state, action) => {
      state.isLoading = false;
      if (action.payload.success) {
        toast.success(action.payload.message, {
          position: toast.POSITION.BOTTOM_RIGHT,
          className: "!bg-slate-900 !text-white",
        });
      }
    });
    builder.addCase(changeUserPassword.rejected, (state, action) => {
      state.isLoading = false;

      toast.error(action.payload, {
        position: toast.POSITION.BOTTOM_RIGHT,
        className: "!bg-slate-900 !text-white",
      });
    });
    builder.addCase(updateUser.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.currentUser.name = action.payload.user.name;
      state.currentUser.avatar = action.payload.user.avatar;
      toast.success(action.payload.message, {
        position: toast.POSITION.BOTTOM_RIGHT,
        className: "!bg-slate-900 !text-white",
      });
    });
    builder.addCase(updateUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      toast.error(action.payload, {
        position: toast.POSITION.BOTTOM_RIGHT,
        className: "!bg-slate-900 !text-white",
      });
    });
  },
});

export const { reset, resetUser } = userSlice.actions;
export const userReducer = userSlice.reducer;
