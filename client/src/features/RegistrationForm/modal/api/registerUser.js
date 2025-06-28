import axiosInstance from "@/shared/api/axiosInstance.js";

export const registerUser = async (
  username,
  email,
  password,
  confirmPassword,
) => {
  try {
    await axiosInstance.post(`/register`, {
      username,
      email,
      password,
      confirmPassword,
    });
  } catch (error) {
    throw new Error(error.response?.data?.error || "Ошибка регистрации");
  }
};
