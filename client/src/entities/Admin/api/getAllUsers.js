import axiosInstance from "@/shared/api/axiosInstance.js";

export const getAllUsers = async () => {
  const response = await axiosInstance.get(`/account/get_users_for_admin`);
  return response.data?.users;
};
