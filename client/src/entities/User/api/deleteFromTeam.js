import axiosInstance from "@/shared/api/axiosInstance.js";

export const deleteFromTeam = async (userId, projectId) => {
  await axiosInstance.delete(`/team/delete_from_team`, {
    data: { userId, projectId },
  });
};
