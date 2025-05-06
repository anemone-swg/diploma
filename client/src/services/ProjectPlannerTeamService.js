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

export const deleteFromTeam = async (user) => {
  try {
    const response = await fetch(
      "http://localhost:5000/team/delete_from_team",
      {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user }),
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
