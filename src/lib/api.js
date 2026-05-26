import axios from "axios";
import { STORAGE_KEYS } from "../utils";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!axios.isCancel(error)) {
      const originalRequest = error.config;

      if (
        error?.response?.status === 401 &&
        !originalRequest._retry &&
        originalRequest.url != "/auth/login"
      ) {
        originalRequest._retry = true;

        try {
          const newAccessToken = await refreshToken();
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          setAuthToken(newAccessToken);
          window.sessionStorage.setItem(STORAGE_KEYS.token, newAccessToken);
          return api(originalRequest);
        } catch (refreshError) {
          console.error("Refresh token expired or invalid. Forced logout.");
          return Promise.reject(refreshError);
        }
      }
    }
    return Promise.reject(error);
  },
);

const refreshToken = async () => {
  const response = await api.post("/auth/refresh");
  const { token } = response.data.data;
  return token;
};

export default api;
