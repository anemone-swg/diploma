import axiosInstance from "@/shared/api/axiosInstance.js";

export const updateTaskTitle = async (id_task, title) => {
  await axiosInstance.put(`/daily-tasks/save_title/${id_task}`, { title });
};
