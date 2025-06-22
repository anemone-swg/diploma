import axiosInstance from "@/shared/api/axiosInstance.js";

export const fetchProjects = async () => {
  const response = await axiosInstance.get(`/projects`);
  return response.data?.projects;
};

export const createProject = async ({ title }) => {
  const response = await axiosInstance.put(`/projects/add`, { title });
  return response.data?.project;
};

export const renameProject = async (projectId, title) => {
  await axiosInstance.put(`/projects/rename/${projectId}`, { title });
};

export const deleteProject = async () => {
  await axiosInstance.delete(`/projects/delete`);
};

export const createTeam = async (title, id_project) => {
  const response = await axiosInstance.post(`/teams/add`, {
    title,
    id_project,
  });
  return response.data?.team;
};

export const renameTeam = async (teamId, title) => {
  await axiosInstance.put(`/teams/rename/${teamId}`, { title });
};

export const deleteTeam = async (teamId) => {
  await axiosInstance.delete(`/teams/delete/${teamId}`);
};

export const createColumn = async (title, id_team) => {
  const response = await axiosInstance.post(`/columns/add`, {
    title,
    id_team,
  });
  return response.data?.column;
};

export const renameColumn = async (columnId, title) => {
  await axiosInstance.put(`/columns/rename/${columnId}`, { title });
};

export const deleteColumn = async (columnId, teamId) => {
  await axiosInstance.delete(`/columns/delete/${columnId}/${teamId}`);
};

export const changeColorColumn = async (color, columnId) => {
  await axiosInstance.put(`/columns/change_color/${columnId}`, { color });
};

export const createTask = async (content, id_column) => {
  const response = await axiosInstance.post(`/tasks/add`, {
    content,
    id_column,
  });
  return response.data?.task;
};

export const deleteTask = async (taskId) => {
  await axiosInstance.delete(`/tasks/delete/${taskId}`);
};

export const taskStatusChange = async (taskId) => {
  await axiosInstance.put(`/tasks/change_status/${taskId}`);
};

export const taskContentChange = async (taskId, content) => {
  await axiosInstance.put(`/tasks/change_content/${taskId}`, { content });
};

export const taskDeadlineChange = async (taskId, deadline) => {
  await axiosInstance.put(`/tasks/change_deadline/${taskId}`, { deadline });
};

export const updateTaskMove = async (taskId, newColumnId) => {
  await axiosInstance.put(`/tasks/move`, {
    taskId,
    newColumnId,
  });
};
