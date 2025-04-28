import { handleUnauthorizedError } from "../utils/utilsFunc.js";

export const fetchTasks = async () => {
  try {
    const response = await fetch("http://localhost:5000/tasks", {
      credentials: "include",
    });

    if (await handleUnauthorizedError(response)) {
      return [];
    }

    const data = await response.json();
    return data.tasks || [];
  } catch (error) {
    console.error("Ошибка загрузки задач:", error);
    return [];
  }
};

export const addTask = async (title, due_date) => {
  try {
    const response = await fetch("http://localhost:5000/tasks/add", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, due_date }),
    });

    if (await handleUnauthorizedError(response)) {
      return null; // Если ошибка 401, возвращаем null
    }

    const data = await response.json();
    return data.success ? data.task : null;
  } catch (error) {
    console.error("Ошибка добавления задачи:", error);
    return null;
  }
};

export const updateDueDate = async (id_task, due_date) => {
  try {
    const response = await fetch(
      `http://localhost:5000/tasks/change_due_date/${id_task}`,
      {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ due_date }),
      },
    );

    if (await handleUnauthorizedError(response)) {
      return false;
    }

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error("Ошибка при обновлении due_date:", error);
    return false;
  }
};

export const updateTaskDescription = async (id_task, description) => {
  try {
    const response = await fetch(
      `http://localhost:5000/tasks/save_desc/${id_task}`,
      {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
      },
    );

    if (await handleUnauthorizedError(response)) {
      return false;
    }

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error("Ошибка при обновлении описания:", error);
    return false;
  }
};

export const updateTaskTitle = async (id_task, newTitle) => {
  try {
    const response = await fetch(
      `http://localhost:5000/tasks/save_title/${id_task}`,
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

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error("Ошибка при обновлении названия задачи:", error);
    return false;
  }
};

export const deleteTask = async (id_task) => {
  try {
    const response = await fetch(
      `http://localhost:5000/tasks/delete/${id_task}`,
      {
        method: "DELETE",
        credentials: "include",
      },
    );

    if (await handleUnauthorizedError(response)) {
      return false;
    }

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error("Ошибка при удалении задачи:", error);
    return false;
  }
};

export const toggleTaskStatus = async (id_task) => {
  try {
    const response = await fetch(
      `http://localhost:5000/tasks/toggle_complete/${id_task}`,
      {
        method: "PUT",
        credentials: "include",
      },
    );

    if (await handleUnauthorizedError(response)) {
      return false;
    }

    if (!response.ok) {
      throw new Error("Не удалось обновить статус задачи");
    }

    return true;
  } catch (error) {
    console.error("Ошибка при переключении статуса задачи:", error);
    return false;
  }
};
