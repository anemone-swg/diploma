import axiosInstance from "@/shared/api/axiosInstance.js";

export const addTask = async (title, due_date) => {
  const response = await axiosInstance.post(`/daily-tasks/add`, {
    title,
    due_date,
  });
  return response.data?.task;
};
