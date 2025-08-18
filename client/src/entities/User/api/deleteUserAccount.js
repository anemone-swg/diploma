import axiosInstance from "@/shared/api/axiosInstance.js";

export const deleteUserAccount = async (id) => {
  try {
    await axiosInstance.delete(`/account/delete/${id}`);
  } catch (error) {
    throw new Error(error.response?.data?.error || "Ошибка удаления аккаунта");
  }
};
