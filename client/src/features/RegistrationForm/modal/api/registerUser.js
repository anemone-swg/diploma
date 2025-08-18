import axiosInstance from "@/shared/api/axiosInstance.js";

export const registerUser = async (
  username,
  email,
  password,
  confirmPassword,
) => {
  try {
    const response = await axiosInstance.post(`/register`, {
      username,
      email,
      password,
      confirmPassword,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Ошибка регистрации");
  }
};
