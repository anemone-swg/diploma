import axiosInstance from "@/shared/api/axiosInstance.js";

export const updateTaskDescription = async (id_task, description) => {
  await axiosInstance.put(`/daily-tasks/save_desc/${id_task}`, { description });
};
