import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getDefect,
  addNewComment,
  updateDefect,
  deleteExistingComment,
  editComment,
  createNewDefect,
  addAttachment,
  removeAttachment,
  searchDefect,
} from "../../utils/api/defect.js";

export const fetchDefect = createAsyncThunk(
  "defect/fetchDefect",
  async (defectId, thunkAPI) => {
    try {
      return await getDefect(defectId);
    } catch (err) {
      const message =
        (err.response && err.response.data && err.response.data.message) ||
        err.message ||
        err.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateExistingDefect = createAsyncThunk(
  "defect/updateExistingDefect",
  async ({ defectId, updates, field }, thunkAPI) => {
    try {
      const result = await updateDefect(defectId, { updates });

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
export const updateAttachments = createAsyncThunk(
  "defect/updateAttachments",
  async ({ defectId, attachment }, thunkAPI) => {
    try {
      const result = await addAttachment(defectId, attachment);
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

export const deleteAttachment = createAsyncThunk(
  "defect/deleteAttachment",
  async ({ defectId, attachmentId, public_id }, thunkAPI) => {
    try {
      const result = await removeAttachment(defectId, attachmentId, public_id);
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
export const searchResults = createAsyncThunk(
  "defect/searchResults",
  async (searchText, thunkAPI) => {
    try {
      const result = await searchDefect(searchText);
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

export const addComment = createAsyncThunk(
  "defect/addComment",
  async ({ defectId, comment, commentId }, thunkAPI) => {
    try {
      if (commentId) {
        return await editComment(defectId, comment, commentId);
      }
      return await addNewComment(defectId, comment);
    } catch (err) {
      const message =
        (err.response && err.response.data && err.response.data.message) ||
        err.message ||
        err.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteComment = createAsyncThunk(
  "defect/deleteComment",
  async ({ commentId, defectId }, thunkAPI) => {
    try {
      return await deleteExistingComment(commentId, defectId);
    } catch (err) {
      const message =
        (err.response && err.response.data && err.response.data.message) ||
        err.message ||
        err.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const createDefect = createAsyncThunk(
  "defect/createDefect",
  async (values, thunkAPI) => {
    try {
      return await createNewDefect(values);
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
  defectDetails: "",
  error: "",
  searchResults: {
    searchLoading: false,
    result: "",
    searchError: "",
  },
  success: "",
};

export const defectSlice = createSlice({
  name: "defect",
  initialState: INITIAL_STATE,
  reducers: {
    reset(state) {
      state.isLoading = "";
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchDefect.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchDefect.fulfilled, (state, action) => {
      state.isLoading = false;
      state.defectDetails = action.payload;
      state.error = "";
    });
    builder.addCase(fetchDefect.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
    builder.addCase(addComment.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(addComment.fulfilled, (state, action) => {
      state.isLoading = false;

      state.defectDetails.defect.Comments = action.payload.defect.Comments;
    });
    builder.addCase(addComment.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
    builder.addCase(updateExistingDefect.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateExistingDefect.fulfilled, (state, action) => {
      state.isLoading = false;
      const UpdatedField = action.payload.UpdatedFields;
      const updatedAssignee = action.payload.defect.assignee;
      Object.entries(UpdatedField).forEach(([key, value]) => {
        if (key === "description") {
          state.defectDetails.defect.description = value;
        }
        if (key === "status") {
          state.defectDetails.defect.status = value;
        }
        if (key === "title") {
          state.defectDetails.defect.title = value;
        }
        if (key === "prioitiy") {
          state.defectDetails.defect.prioitiy = value;
        }
        if (key === "assignee") {
          state.defectDetails.defect.assignee = updatedAssignee;
        }
      });
    });
    builder.addCase(updateExistingDefect.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
    builder.addCase(deleteComment.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(deleteComment.fulfilled, (state, action) => {
      state.isLoading = false;
      const newComments = action.payload.defect.Comments;
      const Ids = newComments.map((comment) => comment._id);
      const existingComments = state.defectDetails.defect.Comments;
      state.defectDetails.defect.Comments = existingComments.filter((comment) =>
        Ids.includes(comment._id)
      );
    });
    builder.addCase(deleteComment.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
    builder.addCase(createDefect.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(createDefect.fulfilled, (state) => {
      state.isLoading = false;
      // state.defectDetails = action.payload.defect.userDefectId;
    });
    builder.addCase(createDefect.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
    builder.addCase(updateAttachments.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateAttachments.fulfilled, (state, action) => {
      state.isLoading = false;
      state.defectDetails.defect.attachments =
        action.payload.defect.attachments;
    });
    builder.addCase(updateAttachments.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
    builder.addCase(deleteAttachment.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(deleteAttachment.fulfilled, (state, action) => {
      state.isLoading = false;
      state.defectDetails.defect.attachments =
        action.payload.defect.attachments;
    });
    builder.addCase(deleteAttachment.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
    builder.addCase(searchResults.pending, (state) => {
      state.searchResults.searchLoading = true;
    });
    builder.addCase(searchResults.fulfilled, (state, action) => {
      state.searchResults.searchLoading = false;
      state.searchResults.result = action.payload.searchResult;
    });
    builder.addCase(searchResults.rejected, (state, action) => {
      state.searchResults.searchLoading = false;
      state.searchResults.searchError = action.payload;
    });
  },
});

export const { reset } = defectSlice.actions;
export const defectReducer = defectSlice.reducer;
