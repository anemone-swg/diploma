import axiosInstance from "@/shared/api/axiosInstance.js";

export const createTeam = async (title, id_project) => {
  const response = await axiosInstance.post(`/teams/add`, {
    title,
    id_project,
  });
  return response.data?.team;
};
