import axiosInstance from "@/shared/api/axiosInstance.js";

export const deleteUserAccountByAdmin = async (userId) => {
  try {
    await axiosInstance.delete(`/account/delete_by_admin`, {
      data: { userId },
    });
  } catch (error) {
    throw new Error(
      error.response?.data?.error ||
        "Ошибка при удалении аккаунта администратором",
    );
  }
};
