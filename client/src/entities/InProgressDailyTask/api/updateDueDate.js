import axiosInstance from "@/shared/api/axiosInstance.js";

export const updateDueDate = async (id_task, due_date) => {
  await axiosInstance.put(`/daily-tasks/change_due_date/${id_task}`, {
    due_date,
  });
};
