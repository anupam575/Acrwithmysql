import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/* ================= MONGO EJSON -> PLAIN VALUES ================= */
/**
 * { $numberInt: "5" } -> 5
 * { $oid: "abc" }     -> "abc"
 * { $date: ... }      -> ISO string
 * Recursively cleans objects and arrays so React never receives
 * an object like { $numberInt } as a child (React error #31).
 */
export const unwrapEJSON = (v) => {
  if (Array.isArray(v)) return v.map(unwrapEJSON);

  if (v && typeof v === "object") {
    if ("$numberInt" in v) return Number(v.$numberInt);
    if ("$numberLong" in v) return Number(v.$numberLong);
    if ("$numberDouble" in v) return Number(v.$numberDouble);
    if ("$numberDecimal" in v) return Number(v.$numberDecimal);
    if ("$oid" in v) return v.$oid;

    if ("$date" in v) {
      const d = new Date(unwrapEJSON(v.$date));
      return isNaN(d.getTime()) ? null : d.toISOString();
    }

    return Object.fromEntries(
      Object.entries(v).map(([k, x]) => [k, unwrapEJSON(x)]),
    );
  }

  return v;
};

/* ================= BASE INSTANCES ================= */
const API = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

const refreshAPI = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

/* ================= STATE ================= */
let isRefreshing = false;
let queue = [];

/* ================= QUEUE HANDLER ================= */
const processQueue = (error) => {
  queue.forEach((p) => (error ? p.reject(error) : p.resolve()));
  queue = [];
};

/* ================= REFRESH TOKEN ================= */
const refreshToken = async () => {
  return refreshAPI.get("/refresh-token");
};

/* ================= INTERCEPTOR ================= */
API.interceptors.response.use(
  (response) => {
    // Clean any leftover Mongo EJSON ($numberInt, $oid, $date...) from every response
    // (skip blobs / files / strings)
    if (response?.data && typeof response.data === "object") {
      const isBinary =
        (typeof Blob !== "undefined" && response.data instanceof Blob) ||
        (typeof ArrayBuffer !== "undefined" &&
          response.data instanceof ArrayBuffer);

      if (!isBinary) {
        response.data = unwrapEJSON(response.data);
      }
    }

    return response;
  },

  async (error) => {
    const original = error.config;

    if (!original) return Promise.reject(error);

    const status = error.response?.status;
    const url = original?.url;

    const isLoginRequest = url?.includes("/login");
    const isRefreshRequest = url?.includes("/refresh-token");

    const isAuthError =
      status === 401 &&
      !original._retry &&
      !isLoginRequest &&
      !isRefreshRequest;

    if (!isAuthError) {
      return Promise.reject(error);
    }

    original._retry = true;

    /* ================= HANDLE MULTIPLE REQUESTS ================= */
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queue.push({ resolve, reject });
      }).then(() => API(original));
    }

    isRefreshing = true;

    try {
      await refreshToken();

      processQueue(null);

      return API(original);
    } catch (err) {
      processQueue(err);

      // ❌ NO window.location redirect anymore
      // ❌ NO router.push anywhere

      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  },
);

export default API;