import axiosInstance from "@/shared/api/axiosInstance.js";

export const createColumn = async (title, id_team) => {
  const response = await axiosInstance.post(`/columns/add`, {
    title,
    id_team,
  });
  return response.data?.column;
};
