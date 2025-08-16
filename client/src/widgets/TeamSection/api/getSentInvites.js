import axiosInstance from "@/shared/api/axiosInstance.js";

export const getSentInvites = async () => {
  const response = await axiosInstance.get(`/team/get_sent_invites`);
  return response.data?.invitations;
};
