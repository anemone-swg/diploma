import axiosInstance from "@/shared/api/axiosInstance.js";

export const updateUserData = async (userData) => {
  try {
    await axiosInstance.put(`/account/update_info`, userData);
  } catch (error) {
    throw new Error(error.response?.data?.error || "Ошибка обновления данных");
  }
};
