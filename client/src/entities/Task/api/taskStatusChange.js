import axiosInstance from "@/shared/api/axiosInstance.js";

export const taskStatusChange = async (taskId) => {
  await axiosInstance.put(`/tasks/change_status/${taskId}`);
};
