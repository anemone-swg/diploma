import axiosInstance from "@/shared/api/axiosInstance.js";

export const taskDeadlineChange = async (taskId, deadline) => {
  await axiosInstance.put(`/tasks/change_deadline/${taskId}`, { deadline });
};
