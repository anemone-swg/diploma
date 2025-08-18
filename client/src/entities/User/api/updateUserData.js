import axiosInstance from "@/shared/api/axiosInstance.js";

export const updateUserData = async (userData, id) => {
  try {
    await axiosInstance.put(`/account/update_info/${id}`, userData);
  } catch (error) {
    throw new Error(error.response?.data?.error || "Ошибка обновления данных");
  }
};
