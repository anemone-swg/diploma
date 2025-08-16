import axiosInstance from "@/shared/api/axiosInstance.js";

export const showTeam = async (projectId) => {
  const response = await axiosInstance.get(`/team/show_team/${projectId}`);
  return response.data?.users;
};
