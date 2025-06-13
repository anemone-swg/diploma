import axios from "axios";

const API_URL = import.meta.env.VITE_SERVER_API_URL;

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      console.error("Сетевая ошибка:", error.message);
    } else {
      const status = error.response.status;
      const errorMessage = error.response.data?.error || "Ошибка сервера";

      console.error("Ошибка:", status, errorMessage);

      if (status === 401) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
