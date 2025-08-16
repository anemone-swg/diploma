import axiosInstance from "@/shared/api/axiosInstance.js";

export const renameTeam = async (teamId, title) => {
  await axiosInstance.put(`/teams/rename/${teamId}`, { title });
};
