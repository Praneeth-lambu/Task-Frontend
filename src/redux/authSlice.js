import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser, logoutUser, registerUser } from '../api/authApi'; // Adjust import path as needed

// Initial state
const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null, // Load user data from localStorage
  token: localStorage.getItem('authToken') || null, // Load token from localStorage
  isAuthenticated: !!localStorage.getItem('authToken'),
  status: 'idle',
  error: null
};

// Thunk for login
export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await loginUser(credentials);
    return response; // Contains token and user data
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// Thunk for logout
export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await logoutUser();
    return;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// Thunk for register
export const register = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const response = await registerUser(userData);
    return response; // Contains success message or user data if needed
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user; // Store user info
        state.token = action.payload.token;
        state.isAuthenticated = true;
        localStorage.setItem('authToken', action.payload.token); // Store token
        localStorage.setItem('user', JSON.stringify(action.payload.user)); // Store user data
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(logout.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(logout.fulfilled, (state) => {
        state.status = 'succeeded';
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        localStorage.removeItem('authToken'); // Remove token
        localStorage.removeItem('user'); // Remove user data
      })
      .addCase(logout.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(register.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Handle registration success, possibly redirect or show a message
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export const { clearError } = authSlice.actions;

export default authSlice.reducer;
