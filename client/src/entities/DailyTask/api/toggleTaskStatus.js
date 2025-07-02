import axiosInstance from "@/shared/api/axiosInstance.js";

export const toggleTaskStatus = async (id_task) => {
  await axiosInstance.put(`/daily-tasks/toggle_complete/${id_task}`);
};
