import axiosInstance from "@/shared/api/axiosInstance.js";

export const createTask = async (content, id_column) => {
  const response = await axiosInstance.post(`/tasks/add`, {
    content,
    id_column,
  });
  return response.data?.task;
};
