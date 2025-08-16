import axiosInstance from "@/shared/api/axiosInstance.js";

export const deleteTeam = async (teamId) => {
  await axiosInstance.delete(`/teams/delete/${teamId}`);
};
