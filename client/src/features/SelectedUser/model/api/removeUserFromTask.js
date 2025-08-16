import axiosInstance from "@/shared/api/axiosInstance.js";

export const removeUserFromTask = async (user, task) => {
  await axiosInstance.delete(`/team/unassign_from_task`, {
    data: { user, task },
  });
};
