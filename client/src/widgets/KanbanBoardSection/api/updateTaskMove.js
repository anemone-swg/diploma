import axiosInstance from "@/shared/api/axiosInstance.js";

export const updateTaskMove = async (taskId, newColumnId) => {
  await axiosInstance.put(`/tasks/move`, {
    taskId,
    newColumnId,
  });
};
