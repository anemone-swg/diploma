import axiosInstance from "@/shared/api/axiosInstance.js";

export async function fetchProjectById(projectId) {
  const response = await axiosInstance.get(`/team/open_project/${projectId}`);
  return response.data;
}
