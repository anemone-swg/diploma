import axiosInstance from "@/shared/api/axiosInstance.js";

export const deleteUserAccount = async () => {
  try {
    await axiosInstance.delete(`/account/delete`);
  } catch (error) {
    throw new Error(error.response?.data?.error || "Ошибка удаления аккаунта");
  }
};
