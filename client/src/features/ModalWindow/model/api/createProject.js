import axiosInstance from "@/shared/api/axiosInstance.js";

export const createProject = async ({ title }) => {
  const response = await axiosInstance.put(`/projects/add`, { title });
  return response.data?.project;
};
