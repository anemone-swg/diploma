import axiosInstance from "@/services/axiosInstance.js";

export const fetchTasks = async () => {
  const response = await axiosInstance.get(`/daily-tasks`);
  return response.data?.tasks;
};

export const addTask = async (title, due_date) => {
  const response = await axiosInstance.post(`/daily-tasks/add`, {
    title,
    due_date,
  });
  return response.data?.task;
};

export const updateDueDate = async (id_task, due_date) => {
  await axiosInstance.put(`/daily-tasks/change_due_date/${id_task}`, {
    due_date,
  });
};

export const updateTaskDescription = async (id_task, description) => {
  await axiosInstance.put(`/daily-tasks/save_desc/${id_task}`, { description });
};

export const updateTaskTitle = async (id_task, title) => {
  await axiosInstance.put(`/daily-tasks/save_title/${id_task}`, { title });
};

export const deleteTask = async (id_task) => {
  await axiosInstance.delete(`/daily-tasks/delete/${id_task}`);
};

export const toggleTaskStatus = async (id_task) => {
  await axiosInstance.put(`/daily-tasks/toggle_complete/${id_task}`);
};
