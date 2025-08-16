import axiosInstance from "@/shared/api/axiosInstance.js";

export const declineInvite = async (id_invite) => {
  await axiosInstance.put(`/team/decline_invite`, { id_invite });
};
