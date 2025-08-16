import axiosInstance from "@/shared/api/axiosInstance.js";

export const selectUserForTask = async (user, task) => {
  const response = await axiosInstance.post(`/team/assign_to_task`, {
    user,
    task,
  });
  return response.data?.assignedUser;
};
