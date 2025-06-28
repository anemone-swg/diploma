import axiosInstance from "@/shared/api/axiosInstance.js";

export const logoutUser = async () => {
  await axiosInstance.post(`/logout`);
};
