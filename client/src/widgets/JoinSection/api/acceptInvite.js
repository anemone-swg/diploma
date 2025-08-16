import axiosInstance from "@/shared/api/axiosInstance.js";

export const acceptInvite = async (id_invite) => {
  await axiosInstance.put(`/team/accept_invite`, { id_invite });
};
