import axiosInstance from "@/shared/api/axiosInstance.js";

export const deleteProject = async () => {
  await axiosInstance.delete(`/projects/delete`);
};
