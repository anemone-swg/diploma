import axiosInstance from "@/shared/api/axiosInstance.js";

export const showInvitations = async () => {
  const response = await axiosInstance.get(`/team/show_invitations`);
  return response.data?.invites;
};
