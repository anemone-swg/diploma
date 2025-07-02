import axiosInstance from "@/shared/api/axiosInstance.js";

export const deleteTask = async (id_task) => {
  await axiosInstance.delete(`/daily-tasks/delete/${id_task}`);
};
