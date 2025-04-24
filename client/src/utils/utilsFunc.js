export const handleUnauthorizedError = async (response) => {
  if (response.status === 401) {
    const data = await response.json();
    console.error(data.message); // "Не авторизован"
    window.location.href = "/login"; // Редирект на страницу входа
    return true; // Вернем true, если ошибка 401, чтобы другие обработчики не продолжались
  }
  return false; // Если это не 401, возвращаем false
};
