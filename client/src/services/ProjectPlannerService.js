import { handleUnauthorizedError } from "../utils/utilsFunc.js";

export const fetchProjects = async () => {
  try {
    const response = await fetch("http://localhost:5000/projects", {
      credentials: "include",
    });

    if (await handleUnauthorizedError(response)) {
      return [];
    }

    const data = await response.json();
    return data.projects || [];
  } catch (error) {
    console.error("Ошибка загрузки задач:", error);
    return [];
  }
};

export const createProject = async ({ title }) => {
  try {
    const response = await fetch("http://localhost:5000/projects/add", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title }),
    });

    if (await handleUnauthorizedError(response)) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Ошибка при создании проекта:", error);
    return null;
  }
};

export const renameProject = async (projectId, newTitle) => {
  try {
    const response = await fetch(
      `http://localhost:5000/projects/rename/${projectId}`,
      {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: newTitle }),
      },
    );

    if (await handleUnauthorizedError(response)) {
      return false;
    }

    return await response.json();
  } catch (error) {
    console.error("Ошибка API renameProject:", error);
    throw false;
  }
};

export const deleteProject = async () => {
  try {
    const response = await fetch(`http://localhost:5000/projects/delete`, {
      method: "DELETE",
      credentials: "include",
    });

    if (await handleUnauthorizedError(response)) {
      return false;
    }

    return await response.json();
  } catch (error) {
    console.error("Ошибка при удалении доски (проекта):", error);
    return false;
  }
};

export const createTeam = async (title, boardId) => {
  try {
    const response = await fetch("http://localhost:5000/projects/teams/add", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, id_project: boardId }),
    });

    if (await handleUnauthorizedError(response)) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Ошибка при создании проекта:", error);
    return null;
  }
};

export const renameTeam = async (projectId, teamId, newTitle) => {
  try {
    const response = await fetch(
      `http://localhost:5000/projects/teams/rename/${teamId}`,
      {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: newTitle, id_project: projectId }),
      },
    );

    if (await handleUnauthorizedError(response)) {
      return false;
    }

    return await response.json();
  } catch (error) {
    console.error("Ошибка API renameTeam:", error);
    throw false;
  }
};
