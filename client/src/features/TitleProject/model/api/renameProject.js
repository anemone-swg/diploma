import axiosInstance from "@/shared/api/axiosInstance.js";

export const renameProject = async (projectId, title) => {
  await axiosInstance.put(`/projects/rename/${projectId}`, { title });
};
