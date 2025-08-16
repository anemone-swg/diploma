import axiosInstance from "@/shared/api/axiosInstance.js";

export const deleteColumn = async (columnId, teamId) => {
  await axiosInstance.delete(`/columns/delete/${columnId}/${teamId}`);
};
