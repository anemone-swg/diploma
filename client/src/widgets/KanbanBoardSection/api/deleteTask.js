import axiosInstance from "@/shared/api/axiosInstance.js";

export const deleteTask = async (taskId) => {
  await axiosInstance.delete(`/tasks/delete/${taskId}`);
};
