import API from "../../utils/axiosInstance";
import { createSlice } from "@reduxjs/toolkit";

// ============================================
// INITIAL STATE
// ============================================
const initialState = {
  roles: [],
  designations: [],
  categories: [],
  departments: [],

  loading: false,
  error: null,
};

// ============================================
// SLICE
// ============================================
const masterSlice = createSlice({
  name: "master",
  initialState,

  reducers: {
    // ============================================
    // COMMON
    // ============================================
    setLoading: (state, action) => {
      state.loading = action.payload ?? true;

      if (action.payload === true) {
        state.error = null;
      }
    },

    setError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    clearError: (state) => {
      state.error = null;
    },

    // ============================================
    // ROLES
    // ============================================
    setRoles: (state, action) => {
      state.roles = action.payload;
      state.loading = false;
    },

    // ============================================
    // DESIGNATIONS
    // ============================================
    setDesignations: (state, action) => {
      state.designations = action.payload;
      state.loading = false;
    },

    // ============================================
    // CATEGORIES
    // ============================================
    setCategories: (state, action) => {
      state.categories = action.payload;
      state.loading = false;
    },

    // ============================================
    // DEPARTMENTS
    // ============================================
    setDepartments: (state, action) => {
      state.departments = action.payload;
      state.loading = false;
    },

    // ============================================
    // RESET MASTER STATE
    // ============================================
    resetMasterState: () => initialState,
  },
});

// ============================================
// EXPORT ACTIONS
// ============================================
export const {
  setLoading,
  setError,
  clearError,

  setRoles,
  setDesignations,
  setCategories,
  setDepartments,

  resetMasterState,
} = masterSlice.actions;

// ============================================
// COMMON ERROR HANDLER
// ============================================
const handleApiError = (dispatch, err, customMessage) => {
  console.log("❌ API ERROR:", err);

  const errorMessage =
    err?.response?.data?.message ||
    err?.message ||
    customMessage ||
    "Something went wrong";

  console.log("❌ ERROR MESSAGE:", errorMessage);

  dispatch(setError(errorMessage));
};

// ============================================
// FETCH ROLES
// ============================================
export const fetchRoles = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));

    console.log("🚀 FETCHING ROLES...");

    const res = await API.get("/roles/all");

    console.log("✅ ROLES RESPONSE:", res?.data);

    const data = (res?.data?.roles || []).map((r) => ({
      _id: r?._id?.toString(),

      name:
        r?.role_name ||
        r?.role_key ||
        r?.name ||
        "Unknown",

      role_key: r?.role_key || "",
    }));

    console.log("🎯 FINAL ROLE DATA:", data);

    dispatch(setRoles(data));

  } catch (err) {
    handleApiError(dispatch, err, "Failed to fetch roles");
  } finally {
    dispatch(setLoading(false));
  }
};

// ============================================
// FETCH DESIGNATIONS
// ============================================
export const fetchDesignations = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));

    console.log("🚀 FETCHING DESIGNATIONS...");

    const res = await API.get("/designations/get");

    console.log("✅ DESIGNATIONS RESPONSE:", res?.data);

    const data = (res?.data?.designations || []).map((d) => ({
      _id: d?._id?.toString(),

      name:
        d?.name ||
        d?.designation_name ||
        d?.title ||
        "Unknown",

      designation_key:
        d?.designation_key || "",
    }));

    console.log("🎯 FINAL DESIGNATION DATA:", data);

    dispatch(setDesignations(data));

  } catch (err) {
    handleApiError(dispatch, err, "Failed to fetch designations");
  } finally {
    dispatch(setLoading(false));
  }
};

// ============================================
// FETCH CATEGORIES
// ============================================
export const fetchCategories = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));

    console.log("🚀 FETCHING CATEGORIES...");

    const res = await API.get("/category");

    console.log("✅ CATEGORY RESPONSE:", res?.data);

    const data = (res?.data?.categories || []).map((c) => ({
      _id: c?._id?.toString(),

      name: c?.name || "Unknown",

      category_key: c?.category_key || "",
    }));

    console.log("🎯 FINAL CATEGORY DATA:", data);

    dispatch(setCategories(data));

  } catch (err) {
    handleApiError(dispatch, err, "Failed to fetch categories");
  } finally {
    dispatch(setLoading(false));
  }
};

// ============================================
// FETCH DEPARTMENTS
// ============================================
export const fetchDepartments = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));

    console.log("🚀 FETCHING DEPARTMENTS...");

    const res = await API.get("/departments/all");

    console.log("✅ DEPARTMENTS RESPONSE:", res?.data);

    const data = (res?.data?.departments || []).map((d) => ({
      _id: d?._id?.toString(),

      name:
        d?.department_name ||
        d?.name ||
        "Unknown",

      department_key:
        d?.department_key || "",
    }));

    console.log("🎯 FINAL DEPARTMENT DATA:", data);

    dispatch(setDepartments(data));

  } catch (err) {
    handleApiError(dispatch, err, "Failed to fetch departments");
  } finally {
    dispatch(setLoading(false));
  }
};

// ============================================
// EXPORT REDUCER
// ============================================
export default masterSlice.reducer;