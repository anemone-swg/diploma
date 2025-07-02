import React, { useEffect } from "react";
import list_styles from "@/features/UserList/ui/UserList.module.css";
import socket from "@/shared/lib/socket/socket.js";
import { getAllUsers } from "@/entities/Admin/api/getAllUsers.js";
import { useDeleteUserByAdmin } from "@/entities/Admin/lib/hooks/useDeleteUserByAdmin.js";
import UserItem from "@/shared/ui/UserItem.jsx";

const UserList = ({ users, setUsers }) => {
  const deleteUserByAdmin = useDeleteUserByAdmin();

  useEffect(() => {
    const fetchUsers = () => {
      getAllUsers().then((data) => {
        setUsers(data);
      });
    };

    fetchUsers();

    socket.on("userDeleted", fetchUsers);
    socket.on("userRegistered", fetchUsers);

    return () => {
      socket.off("userDeleted", fetchUsers);
      socket.off("userRegistered", fetchUsers);
    };
  }, [setUsers]);

  const handleDeleteUserByAdmin = (user) => {
    deleteUserByAdmin(user, (deletedUser) => {
      setUsers((prev) => prev.filter((u) => u.id_user !== deletedUser.id_user));
    });
  };

  return (
    <div className={list_styles.userList}>
      <h2>Список пользователей</h2>
      {users.map((user) => (
        <UserItem
          key={user.id_user}
          user={user}
          onDelete={handleDeleteUserByAdmin}
          BtnText={"Удалить пользователя"}
        />
      ))}
    </div>
  );
};

export default UserList;
