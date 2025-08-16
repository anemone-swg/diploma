import axiosInstance from "@/shared/api/axiosInstance.js";

export const searchUsersByLogin = async (login) => {
  const response = await axiosInstance.get(`/team/search_users/${login}`);
  return response.data?.users;
};
