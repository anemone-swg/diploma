import refreshInstance from "@/shared/api/axiosInstance.js";

export const checkAuth = async () => {
  // const response = await axiosInstance.get(`/check-auth`);
  try {
    const response = await refreshInstance.get(`/refresh`);
    return response.data;
  } catch (error) {
    const status = error.response.status;
    const errorMessage = error.response.data?.error || "Ошибка сервера";
    console.error("Ошибка:", status, errorMessage);
  }
};
