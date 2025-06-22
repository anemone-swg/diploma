import axiosInstance from "@/shared/api/axiosInstance.js";

export const uploadAvatar = async (file) => {
  const formData = new FormData();
  formData.append("avatar", file);
  await axiosInstance.post("/account/upload_avatar", formData);
};

export const fetchUserData = async () => {
  const response = await axiosInstance.get(`/account`);
  return response.data;
};

export const updateUserData = async (userData) => {
  try {
    await axiosInstance.put(`/account/update_info`, userData);
  } catch (error) {
    throw new Error(error.response?.data?.error || "Ошибка обновления данных");
  }
};

export const deleteUserAccount = async () => {
  try {
    await axiosInstance.delete(`/account/delete`);
  } catch (error) {
    throw new Error(error.response?.data?.error || "Ошибка удаления аккаунта");
  }
};

export const changeUserLogin = async (newLogin) => {
  try {
    await axiosInstance.put(`/account/change_login`, { newLogin });
  } catch (error) {
    throw new Error(error.response?.data?.error || "Ошибка изменения логина");
  }
};

export const getAllUsers = async () => {
  const response = await axiosInstance.get(`/account/get_users_for_admin`);
  return response.data?.users;
};

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
