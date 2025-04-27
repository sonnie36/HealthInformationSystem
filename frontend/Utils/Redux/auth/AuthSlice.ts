import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { endpoint } from "../../endpoint";

// Async thunk for user registration
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData: { email: string; password: string; fullName: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${endpoint}/auth/register`, userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message?.data || "Registration failed");
    }
  }
);

// Async thunk for user login
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${endpoint}/auth/login`, credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed. Invalid Credentials");
    }
  }
);

// Initial state for the auth slice
const initialState = {
  user: null,
  token: null,
  loading: false,
  error: null as string | null,
};

// Auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Handle register actions
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | null;
      });

    // Handle login actions
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | null;
      });
  },
});

// Export actions and reducer
export const { logout } = authSlice.actions;
export default authSlice.reducer;