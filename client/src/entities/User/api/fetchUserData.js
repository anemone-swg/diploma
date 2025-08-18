import axiosInstance from "@/shared/api/axiosInstance.js";

export const fetchUserData = async (id) => {
  const response = await axiosInstance.get(`/account/${id}`);
  return response.data;
};
