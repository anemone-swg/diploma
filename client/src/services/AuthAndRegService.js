import { handleUnauthorizedError } from "../utils/utilsFunc.js";

export const registerUser = async (
  username,
  email,
  password,
  confirmPassword,
) => {
  const response = await fetch("http://localhost:5000/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password, confirmPassword }),
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.error || "Ошибка регистрации");
  }

  return responseData;
};

export const loginUser = async (username, password) => {
  const response = await fetch("http://localhost:5000/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
    credentials: "include",
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.error || "Ошибка авторизации");
  }

  return responseData;
};

export const logoutUser = async () => {
  const response = await fetch("http://localhost:5000/logout", {
    method: "POST",
    credentials: "include",
  });

  if (await handleUnauthorizedError(response)) {
    return [];
  }

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.error || "Ошибка выхода");
  }

  return responseData;
};

export const checkAuth = async () => {
  const response = await fetch("http://localhost:5000/check-auth", {
    method: "GET",
    credentials: "include",
  });

  return await response.json();
};
