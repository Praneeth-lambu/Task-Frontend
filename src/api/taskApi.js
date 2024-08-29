import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getAuthHeaders } from './authApi';

const API_URL = process.env.REACT_APP_API_URL;

// Helper function to handle API errors
const handleError = (error) => {
  if (error.response) {
    // Server responded with a status other than 2xx
    return {
      status: error.response.status,
      message: error.response.data.msg || 'An unexpected error occurred'
    };
  } else if (error.request) {
    // No response received from server
    return {
      status: null,
      message: 'No response received from server'
    };
  } else {
    // Error setting up the request
    return {
      status: null,
      message: error.message || 'Network Error'
    };
  }
};

// Fetch Tasks
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (taskId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/tasks/getTask/${taskId}`, { headers: getAuthHeaders() });
      return response.data;
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

// Add Task
export const addTask = createAsyncThunk(
  'tasks/addTask',
  async (task, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/tasks/addTask`, task, { headers: getAuthHeaders() });
      return response.data;
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

// Update Task
export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async (task, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/tasks/updateTask/${task._id}`, task, { headers: getAuthHeaders() });
      return response.data;
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

// Delete Task
export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (taskId, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/tasks/deleteTask/${taskId}`, { headers: getAuthHeaders() });
      return taskId;
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);
