import axiosInstance from "@/shared/api/axiosInstance.js";

export const changeUserLogin = async (newLogin) => {
  try {
    const response = await axiosInstance.put(`/account/change_login`, {
      newLogin,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Ошибка изменения логина");
  }
};
