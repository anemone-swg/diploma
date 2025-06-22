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

export const loginUser = async (username, password) => {
  try {
    const response = await axiosInstance.post(`/login`, { username, password });
    return response.data?.role;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Ошибка авторизации");
  }
};

export const logoutUser = async () => {
  await axiosInstance.post(`/logout`);
};

export const checkAuth = async () => {
  const response = await axiosInstance.get(`/check-auth`);
  return response.data;
};
