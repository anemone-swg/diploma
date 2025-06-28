import { toast } from "react-toastify";
import { deleteUserAccountByAdmin } from "@/entities/Admin/api/deleteUserAccountByAdmin.js";

export const useDeleteUserByAdmin = () => {
  return (user, onSuccess) => {
    const confirmDelete = window.confirm(`Удалить пользователя ${user.login}?`);
    if (!confirmDelete) return;

    deleteUserAccountByAdmin(user.id_user)
      .then(() => {
        toast.success("Пользователь удалён");
        if (onSuccess) onSuccess(user);
      })
      .catch((error) => {
        toast.error(error.message || "Ошибка при удалении пользователя");
      });
  };
};
