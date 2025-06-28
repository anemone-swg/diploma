import React, { useEffect } from "react";
import list_styles from "@/features/UserList/ui/UserList.module.css";
import team_members from "@/widgets/TeamSection/ui/ui/TeamMembers.module.css";
import search_members from "@/widgets/TeamSection/ui/ui/SearchMembers.module.css";
import defaultAvatar from "@/shared/assets/default_avatar.jpg";
import DefaultBtn from "@/shared/ui/DefaultBtn.jsx";
import { MdCancel } from "react-icons/md";
import socket from "@/shared/lib/socket/socket.js";
import { getAllUsers } from "@/entities/Admin/api/getAllUsers.js";
import { useDeleteUserByAdmin } from "@/entities/Admin/lib/hooks/useDeleteUserByAdmin.js";

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
        <div key={user.id_user} className={team_members.memberOfTeam}>
          <img
            className={search_members.userAvatar}
            src={user.avatar || defaultAvatar}
            alt="Аватар"
          />
          <div>
            <p>
              <strong>{user.login}</strong>
            </p>
            <p className={search_members.userNameInfo}>
              {user.firstName} {user.lastName}
            </p>
          </div>
          <div className={list_styles.deleteBtn}>
            <DefaultBtn
              svgMargin
              icon={MdCancel}
              onClick={() => handleDeleteUserByAdmin(user)}
            >
              Удалить пользователя
            </DefaultBtn>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserList;
