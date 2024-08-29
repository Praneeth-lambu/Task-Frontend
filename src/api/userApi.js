// userApi.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getAuthHeaders } from './authApi'; // Import getAuthHeaders function

const API_URL = process.env.REACT_APP_API_URL;

// Helper function to handle API errors
const handleError = (error) => {
  if (error.response) {
    return {
      status: error.response.status,
      message: error.response.data.msg || 'An unexpected error occurred'
    };
  } else if (error.request) {
    return {
      status: null,
      message: 'No response received from server'
    };
  } else {
    return {
      status: null,
      message: error.message || 'Network Error'
    };
  }
};

// Fetch Users
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/users/getUser/${userId}`, { headers: getAuthHeaders() });
      return response.data;
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

// Add User
export const addUser = createAsyncThunk(
  'users/addUser',
  async (user, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/users/addUser`, user, { headers: getAuthHeaders() });
      return response.data;
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

// Update User
export const updateUser = createAsyncThunk(
  'users/updateUser',
  async (user, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/users/updateUser/${user._id}`, user, { headers: getAuthHeaders() });
      return response.data;
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

// Delete User
export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (userId, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/users/deleteUser/${userId}`, { headers: getAuthHeaders() });
      return userId;
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);
