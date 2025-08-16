import axiosInstance from "@/shared/api/axiosInstance.js";

export const fetchCurrentUser = async () => {
  const response = await axiosInstance.get(`/team/me`);
  return response.data;
};
