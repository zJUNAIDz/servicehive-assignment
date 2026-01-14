import axios from "axios";

let isRefreshing = false;
let refreshQueue: (() => void)[] = [];

function subscribeTokenRefresh(cb: () => void) {
  refreshQueue.push(cb);
}

function onRefreshed() {
  refreshQueue.forEach((cb) => cb());
  refreshQueue = [];
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:4000",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
api.interceptors.response.use(
  res => res,
  async error => {
    const originalRequest = error.config;

    // Not auth error → bubble up
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // Prevent infinite loop
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    // If refresh already happening → wait
    if (isRefreshing) {
      return new Promise(resolve => {
        subscribeTokenRefresh(() => {
          resolve(api(originalRequest));
        });
      });
    }

    isRefreshing = true;

    try {
      await api.post("/auth/refresh");
      isRefreshing = false;
      onRefreshed();
      return api(originalRequest);
    } catch (refreshErr) {
      isRefreshing = false;

      // Refresh token expired → session dead
      window.location.href = "/login";
      return Promise.reject(refreshErr);
    }
  }
);
