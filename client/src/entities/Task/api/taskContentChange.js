import axiosInstance from "@/shared/api/axiosInstance.js";

export const taskContentChange = async (taskId, content) => {
  await axiosInstance.put(`/tasks/change_content/${taskId}`, { content });
};
