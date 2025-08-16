import axiosInstance from "@/shared/api/axiosInstance.js";

export const cancelInvite = async (toUserId) => {
  await axiosInstance.delete(`/team/cancel_invite`, { data: { toUserId } });
};
