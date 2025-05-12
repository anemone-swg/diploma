import { handleUnauthorizedError } from "@/utils/utilsFunc.js";

export const searchUsersByLogin = async (login) => {
  try {
    const response = await fetch(
      `http://localhost:5000/team/search_users/${login}`,
      {
        credentials: "include",
      },
    );

    if (await handleUnauthorizedError(response)) {
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error("Ошибка поиска пользователей:", error);
    return [];
  }
};

export const handleInvite = async (toUserId, projectId) => {
  try {
    const response = await fetch("http://localhost:5000/team/invite", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ toUserId, projectId }),
    });

    if (await handleUnauthorizedError(response)) {
      return [];
    }

    return response.json();
  } catch (error) {
    console.error("Ошибка приглашения:", error.message);
  }
};

export const getSentInvites = async () => {
  try {
    const response = await fetch(
      "http://localhost:5000/team/get_sent_invites",
      {
        credentials: "include",
      },
    );

    if (await handleUnauthorizedError(response)) {
      return [];
    }

    return response.json();
  } catch (error) {
    console.error("Ошибка загрузки приглашенных пользователей:", error.message);
  }
};

export const cancelInvite = async (toUserId) => {
  try {
    const response = await fetch("http://localhost:5000/team/cancel_invite", {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ toUserId }),
    });

    if (await handleUnauthorizedError(response)) {
      return [];
    }

    return response.json();
  } catch (error) {
    console.error("Ошибка удаления приглашения:", error);
  }
};

export const showInvitations = async () => {
  try {
    const response = await fetch(
      `http://localhost:5000/team/show_invitations`,
      {
        credentials: "include",
      },
    );

    if (await handleUnauthorizedError(response)) {
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error("Ошибка поиска приглашений:", error);
    return [];
  }
};

export const acceptInvite = async (id_invite) => {
  try {
    const response = await fetch(`http://localhost:5000/team/accept_invite`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_invite }),
    });

    if (await handleUnauthorizedError(response)) {
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error("Ошибка принятия приглашения:", error);
    return [];
  }
};

export const declineInvite = async (id_invite) => {
  try {
    const response = await fetch(`http://localhost:5000/team/decline_invite`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_invite }),
    });

    if (await handleUnauthorizedError(response)) {
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error("Ошибка отклонения приглашения:", error);
    return [];
  }
};

export const showTeam = async (projectId) => {
  try {
    const response = await fetch(
      `http://localhost:5000/team/show_team/${projectId}`,
      {
        credentials: "include",
      },
    );

    if (await handleUnauthorizedError(response)) {
      return [];
    }

    if (response.status === 404) {
      // Команда не найдена, возвращаем пустой массив
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error("Ошибка поиска приглашений:", error);
    return [];
  }
};

export const deleteFromTeam = async (userId, projectId) => {
  try {
    const response = await fetch(
      "http://localhost:5000/team/delete_from_team",
      {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, projectId }),
      },
    );

    if (await handleUnauthorizedError(response)) {
      return [];
    }

    return response.json();
  } catch (error) {
    console.error("Ошибка при удалении участника команды из нее:", error);
  }
};

export const selectUserForTask = async (user, task) => {
  try {
    const response = await fetch("http://localhost:5000/team/assign_to_task", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user, task }),
    });

    if (await handleUnauthorizedError(response)) {
      return [];
    }

    return response.json();
  } catch (error) {
    console.error("Ошибка при удалении участника команды из нее:", error);
  }
};

export const removeUserFromTask = async (user, task) => {
  try {
    const res = await fetch("http://localhost:5000/team/unassign_from_task", {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user, task }),
    });

    return await res.json();
  } catch (e) {
    console.error("Ошибка при удалении пользователя из задачи:", e);
  }
};

export async function fetchProjectById(projectId) {
  try {
    const response = await fetch(
      `http://localhost:5000/team/open_project/${projectId}`,
      {
        credentials: "include",
      },
    );

    if (await handleUnauthorizedError(response)) {
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error("Ошибка при получении проекта:", error);
    throw error;
  }
}

export const fetchCurrentUser = async () => {
  try {
    const response = await fetch(`http://localhost:5000/team/me`, {
      credentials: "include",
    });

    if (await handleUnauthorizedError(response)) {
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error("Ошибка поиска пользователя:", error);
    return [];
  }
};
