"use client";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../utils/axiosInstance";

// 🔥 Fetch current user (/me)
export const fetchUser = createAsyncThunk(
  "auth/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get("/me");
      return data?.user || null;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Not authenticated"
      );
    }
  }
);

const initialState = {
  user: null,
  isAuthenticated: false,
  authChecked: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.authChecked = true;
      state.loading = false;
      state.error = null;
    },

    // ⚠️ still exists but NOT used in login anymore
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.authChecked = true;
    },

    logoutUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.authChecked = true;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchUser.fulfilled, (state, action) => {
          console.log("🔥 fetchUser fulfilled payload:", action.payload);

        state.user = action.payload;
        state.isAuthenticated = !!action.payload;
        state.authChecked = true;
        state.loading = false;
      })

      .addCase(fetchUser.rejected, (state, action) => {
        state.user = null;
        state.isAuthenticated = false;
        state.authChecked = true;
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearUser, setUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;