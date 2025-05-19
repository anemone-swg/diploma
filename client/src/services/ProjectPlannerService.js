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

export const deleteTeam = async (teamId) => {
  try {
    const response = await fetch(
      `http://localhost:5000/projects/teams/delete/${teamId}`,
      {
        method: "DELETE",
        credentials: "include",
      },
    );

    if (await handleUnauthorizedError(response)) {
      return false;
    }

    return await response.json();
  } catch (error) {
    console.error("Ошибка при удалении команды проекта:", error);
    return false;
  }
};

export const createColumn = async (title, teamId) => {
  try {
    const response = await fetch(
      "http://localhost:5000/projects/teams/columns/add",
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, id_team: teamId }),
      },
    );

    if (await handleUnauthorizedError(response)) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Ошибка при создании столбца:", error);
    return null;
  }
};

export const renameColumn = async (columnId, newTitle) => {
  try {
    const response = await fetch(
      `http://localhost:5000/projects/teams/columns/rename/${columnId}`,
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
    console.error("Ошибка API renameColumn:", error);
    throw false;
  }
};

export const deleteColumn = async (columnId, teamId) => {
  try {
    const response = await fetch(
      `http://localhost:5000/projects/teams/columns/delete/${columnId}/${teamId}`,
      {
        method: "DELETE",
        credentials: "include",
      },
    );

    if (await handleUnauthorizedError(response)) {
      return false;
    }

    return await response.json();
  } catch (error) {
    console.error("Ошибка при удалении столбца команды:", error);
    return false;
  }
};

export const changeColorColumn = async (color, columnId) => {
  try {
    const response = await fetch(
      `http://localhost:5000/projects/teams/columns/change_color/${columnId}`,
      {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ color }),
      },
    );

    if (await handleUnauthorizedError(response)) {
      return false;
    }

    return await response.json();
  } catch (error) {
    console.error("Ошибка API changeColorColumn:", error);
    throw false;
  }
};

export const createTask = async (content, columnId) => {
  try {
    const response = await fetch(
      "http://localhost:5000/projects/teams/columns/tasks/add",
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content, id_column: columnId }),
      },
    );

    if (await handleUnauthorizedError(response)) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Ошибка при создании столбца:", error);
    return null;
  }
};

export const deleteTask = async (taskId) => {
  try {
    const response = await fetch(
      `http://localhost:5000/projects/teams/columns/tasks/delete/${taskId}`,
      {
        method: "DELETE",
        credentials: "include",
      },
    );

    if (await handleUnauthorizedError(response)) {
      return false;
    }

    return await response.json();
  } catch (error) {
    console.error("Ошибка при удалении задачи:", error);
    return false;
  }
};

export const taskStatusChange = async (taskId) => {
  try {
    const response = await fetch(
      `http://localhost:5000/projects/teams/columns/tasks/change_status/${taskId}`,
      {
        method: "PUT",
        credentials: "include",
      },
    );

    if (await handleUnauthorizedError(response)) {
      return false;
    }

    return await response.json();
  } catch (error) {
    console.error("Ошибка API taskStatusChange:", error);
    throw false;
  }
};

export const taskContentChange = async (taskId, content) => {
  try {
    const response = await fetch(
      `http://localhost:5000/projects/teams/columns/tasks/change_content/${taskId}`,
      {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      },
    );

    if (await handleUnauthorizedError(response)) {
      return false;
    }

    return await response.json();
  } catch (error) {
    console.error("Ошибка API taskContentChange:", error);
    throw false;
  }
};

export const taskDeadlineChange = async (taskId, deadline) => {
  try {
    const response = await fetch(
      `http://localhost:5000/projects/teams/columns/tasks/change_deadline/${taskId}`,
      {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ deadline }),
      },
    );

    if (await handleUnauthorizedError(response)) {
      return false;
    }

    return await response.json();
  } catch (error) {
    console.error("Ошибка API taskDeadlineChange:", error);
    throw false;
  }
};

export const updateTaskMove = async (taskId, newColumnId) => {
  try {
    const response = await fetch(
      "http://localhost:5000/projects/teams/columns/tasks/move",
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          taskId,
          newColumnId,
        }),
      },
    );

    if (await handleUnauthorizedError(response)) {
      return false;
    }

    return await response.json();
  } catch (error) {
    console.error("Ошибка API updateTaskOrder:", error);
    throw false;
  }
};
