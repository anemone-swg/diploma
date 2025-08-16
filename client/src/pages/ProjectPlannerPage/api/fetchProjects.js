import axiosInstance from "@/shared/api/axiosInstance.js";

export const fetchProjects = async () => {
  const response = await axiosInstance.get(`/projects`);
  return response.data?.projects;
};
