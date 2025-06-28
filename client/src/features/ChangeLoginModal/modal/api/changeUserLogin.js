import axiosInstance from "@/shared/api/axiosInstance.js";

export const changeUserLogin = async (newLogin) => {
  try {
    await axiosInstance.put(`/account/change_login`, { newLogin });
  } catch (error) {
    throw new Error(error.response?.data?.error || "Ошибка изменения логина");
  }
};
