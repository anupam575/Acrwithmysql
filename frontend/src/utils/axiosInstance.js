import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

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
  (response) => response,

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
  }
);

export default API;