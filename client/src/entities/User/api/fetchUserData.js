import axiosInstance from "@/shared/api/axiosInstance.js";

export const fetchUserData = async () => {
  const response = await axiosInstance.get(`/account`);
  return response.data;
};
