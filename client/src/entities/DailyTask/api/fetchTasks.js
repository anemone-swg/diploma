import axiosInstance from "@/shared/api/axiosInstance.js";

export const fetchTasks = async () => {
  const response = await axiosInstance.get(`/daily-tasks`);
  return response.data?.tasks;
};
