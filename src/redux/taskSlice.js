// taskSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { fetchTasks, addTask, updateTask, deleteTask } from '../api/taskApi';

const initialState = {
  tasks: [],
  status: 'idle',
  error: null,
};

export const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = 'idle';
        state.tasks = Array.isArray(action.payload) ? action.payload : [action.payload];
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'An error occurred. Please try again later.';
      })
      .addCase(addTask.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.status = 'idle';
        state.tasks.push(action.payload);
      })
      .addCase(addTask.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'An error occurred. Please try again later.';
      })
      .addCase(updateTask.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.status = 'idle';
        state.tasks = state.tasks.map(task =>
          task._id === action.payload._id ? action.payload : task
        );
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'An error occurred. Please try again later.';
      })
      .addCase(deleteTask.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.status = 'idle';
        state.tasks = state.tasks.filter(task => task._id !== action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'An error occurred. Please try again later.';
      });
  },
});

export default taskSlice.reducer;
  