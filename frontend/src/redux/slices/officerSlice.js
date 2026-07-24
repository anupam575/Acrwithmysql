import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../utils/axiosInstance";

export const fetchParOfficers = createAsyncThunk(
  "officers/fetchParOfficers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get("/employees/users/par-roles");


      return res.data.data; // ✅ FIXED HERE
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ================= SLICE ================= */
const officerSlice = createSlice({
  name: "officers",
  initialState: {
    reportingOfficers: [],
    reviewingOfficers: [],
    acceptingOfficers: [],
    loading: false,
    error: null,
  },

  reducers: {
    // optional future reducers
    clearOfficersState: (state) => {
      state.reportingOfficers = [];
      state.reviewingOfficers = [];
      state.acceptingOfficers = [];
      state.error = null;
      state.loading = false;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchParOfficers.pending, (state) => {
        state.loading = true;
      })

     .addCase(fetchParOfficers.fulfilled, (state, action) => {
  state.loading = false;

  const data = action.payload || {};

  state.reportingOfficers = data.reportingOfficers || [];
  state.reviewingOfficers = data.reviewingOfficers || [];
  state.acceptingOfficers = data.acceptingOfficers || [];

  console.log("OFFICERS API:", data);
})

      .addCase(fetchParOfficers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearOfficersState } = officerSlice.actions;

export default officerSlice.reducer;