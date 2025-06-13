import axiosInstance from "@/services/axiosInstance.js";

export const searchUsersByLogin = async (login) => {
  const response = await axiosInstance.get(`/team/search_users/${login}`);
  return response.data?.users;
};

export const sendInvite = async (toUserId, projectId) => {
  await axiosInstance.post(`/team/invite`, { toUserId, projectId });
};

export const getSentInvites = async () => {
  const response = await axiosInstance.get(`/team/get_sent_invites`);
  return response.data?.invitations;
};

export const cancelInvite = async (toUserId) => {
  await axiosInstance.delete(`/team/cancel_invite`, { data: { toUserId } });
};

export const showInvitations = async () => {
  const response = await axiosInstance.get(`/team/show_invitations`);
  return response.data?.invites;
};

export const acceptInvite = async (id_invite) => {
  await axiosInstance.put(`/team/accept_invite`, { id_invite });
};

export const declineInvite = async (id_invite) => {
  await axiosInstance.put(`/team/decline_invite`, { id_invite });
};

export const showTeam = async (projectId) => {
  const response = await axiosInstance.get(`/team/show_team/${projectId}`);
  return response.data?.users;
};

export const deleteFromTeam = async (userId, projectId) => {
  await axiosInstance.delete(`/team/delete_from_team`, {
    data: { userId, projectId },
  });
};

export const selectUserForTask = async (user, task) => {
  const response = await axiosInstance.post(`/team/assign_to_task`, {
    user,
    task,
  });
  return response.data?.assignedUser;
};

export const removeUserFromTask = async (user, task) => {
  await axiosInstance.delete(`/team/unassign_from_task`, {
    data: { user, task },
  });
};

export async function fetchProjectById(projectId) {
  const response = await axiosInstance.get(`/team/open_project/${projectId}`);
  return response.data;
}

export const fetchCurrentUser = async () => {
  const response = await axiosInstance.get(`/team/me`);
  return response.data;
};
