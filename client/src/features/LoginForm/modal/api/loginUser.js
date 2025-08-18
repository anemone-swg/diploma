import axiosInstance from "@/shared/api/axiosInstance.js";

export const loginUser = async (username, password) => {
  try {
    const response = await axiosInstance.post(`/login`, { username, password });
    // return response.data?.role;
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Ошибка аутентификации");
  }
};
