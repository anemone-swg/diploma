import { handleUnauthorizedError } from "../utils/utilsFunc.js";

export const uploadAvatar = async (file) => {
  const formData = new FormData();
  formData.append("avatar", file);

  try {
    const response = await fetch(
      "http://localhost:5000/account/upload-avatar",
      {
        method: "POST",
        credentials: "include", // Важно для передачи сессии
        body: formData,
      },
    );

    if (await handleUnauthorizedError(response)) {
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error("Ошибка при загрузке аватара:", error);
    throw error;
  }
};

export const fetchUserData = async () => {
  try {
    const response = await fetch("http://localhost:5000/account", {
      method: "GET",
      credentials: "include", // Передача куков для аутентификации
    });

    if (await handleUnauthorizedError(response)) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Ошибка загрузки данных:", error);
    return null;
  }
};

export const updateUserData = async (userData) => {
  const response = await fetch("http://localhost:5000/account/update", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
    credentials: "include",
  });

  if (await handleUnauthorizedError(response)) {
    return [];
  }

  const result = await response.json(); // Разбираем JSON-ответ

  if (!response.ok) {
    throw new Error(result.message || "Ошибка обновления данных"); // Показываем сообщение сервера
  }

  return result;
};

export const deleteUserAccount = async () => {
  const response = await fetch("http://localhost:5000/account/delete", {
    method: "DELETE",
    credentials: "include",
  });

  if (await handleUnauthorizedError(response)) {
    return [];
  }

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Ошибка удаления аккаунта");
  }

  return result;
};

export const changeUserLogin = async (newLogin) => {
  const response = await fetch("http://localhost:5000/account/change_login", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ newLogin }),
    credentials: "include",
  });

  if (await handleUnauthorizedError(response)) {
    return [];
  }

  const result = await response.json(); // Разбираем JSON-ответ

  if (!response.ok) {
    throw new Error(result.message || "Ошибка обновления данных"); // Показываем сообщение сервера
  }

  return result;
};
