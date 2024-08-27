// src/slices/commentsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchCommentsFromApi, handleAddCommentAPI } from '../api/commentApi';

// Thunks
export const fetchComments = createAsyncThunk(
    'comments/fetchComments',
    async (taskId) => {
      const response = await fetchCommentsFromApi(taskId);
      return response;
    }
  );
  

// src/slices/commentsSlice.js
export const addComment = createAsyncThunk(
    'comments/addComment',
    async ({ taskId, commentData }, { rejectWithValue }) => {
      try {
        const comment = await handleAddCommentAPI(taskId, commentData);
        return { taskId, comment }; // Ensure this is a plain object
      } catch (error) {
        return rejectWithValue(error.message); // Properly handle errors
      }
    }
  );

// Slice
const commentsSlice = createSlice({
  name: 'comments',
  initialState: {
    comments: {},
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.comments[action.meta.arg] = action.payload;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload; // Make sure this matches the error payload
      })
      .addCase(addComment.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { taskId, comment } = action.payload;
        if (!state.comments[taskId]) {
          state.comments[taskId] = [];
        }
        state.comments[taskId].push(comment);
      })
      .addCase(addComment.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload; // Make sure this matches the error payload
      });
  }
});


export default commentsSlice.reducer;
