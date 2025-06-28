import axiosInstance from "@/shared/api/axiosInstance.js";

export const checkAuth = async () => {
  const response = await axiosInstance.get(`/check-auth`);
  return response.data;
};
