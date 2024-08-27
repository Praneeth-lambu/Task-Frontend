// authApi.js
import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000'; // Replace with your actual API URL

// Function to store the token in localStorage
export const storeToken = (token) => {
  localStorage.setItem('authToken', token);
};

// Function to retrieve the token from localStorage
export const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

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

// API call to log in
export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    const { token, user } = response.data;
    storeToken(token); // Store token in localStorage
    return { token, user }; // Return user data and token
  } catch (error) {
    throw new Error(handleError(error).message);
  }
};

// API call to register a new user (if needed)
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    return response.data; // Only process non-sensitive data here
  } catch (error) {
    throw new Error(handleError(error).message);
  }
};

// Logout
export const logoutUser = () => {
  localStorage.removeItem('authToken'); // Remove token from localStorage
};

// API call to get user data
export const getUserData = async () => {
  try {
    const response = await axios.get(`${API_URL}/user/profile`, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    throw new Error(handleError(error).message);
  }
};

