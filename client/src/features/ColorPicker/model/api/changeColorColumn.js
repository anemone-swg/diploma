import axiosInstance from "@/shared/api/axiosInstance.js";

export const changeColorColumn = async (color, columnId) => {
  await axiosInstance.put(`/columns/change_color/${columnId}`, { color });
};
