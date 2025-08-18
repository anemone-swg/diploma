import axios from "axios";

const API_URL = import.meta.env.VITE_SERVER_API_URL;

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

const refreshInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!error.response) {
      console.error("Сетевая ошибка:", error.message);
    } else {
      const status = error.response.status;
      const errorMessage = error.response.data?.error || "Ошибка сервера";

      console.error("Ошибка:", status, errorMessage);

      const originalRequest = error.config;
      if (status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const response = await refreshInstance.get(`/refresh`);
          localStorage.setItem("token", response.data.accessToken);
          return axiosInstance.request(originalRequest);
        } catch (error) {
          const status = error.response.status;
          const errorMessage = error.response.data?.error || "Ошибка сервера";
          console.error("Ошибка:", status, errorMessage);
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
