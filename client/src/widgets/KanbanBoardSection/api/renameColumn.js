import axiosInstance from "@/shared/api/axiosInstance.js";

export const renameColumn = async (columnId, title) => {
  await axiosInstance.put(`/columns/rename/${columnId}`, { title });
};
