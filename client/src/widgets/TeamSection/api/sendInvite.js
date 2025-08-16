import axiosInstance from "@/shared/api/axiosInstance.js";

export const sendInvite = async (toUserId, projectId) => {
  await axiosInstance.post(`/team/invite`, { toUserId, projectId });
};
