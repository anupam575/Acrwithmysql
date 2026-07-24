import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/authslice";
import masterReducer from "./slices/masterSlice";
import officerReducer from "./slices/officerSlice";

import { serializableFixMiddleware } from "./middleware/serializableFixMiddleware";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    master: masterReducer,
    officers: officerReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(serializableFixMiddleware),

  devTools: process.env.NODE_ENV !== "production",
});