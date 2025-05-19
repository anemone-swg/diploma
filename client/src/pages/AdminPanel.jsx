import React, { useEffect, useState } from "react";
import {
  deleteUserAccountByAdmin,
  getAllUsers,
} from "@/services/AccountService.js";
import main_styles from "@/styles/App.module.css";
import { RiAdminFill } from "react-icons/ri";
import admin_styles from "@/styles/AdminPanel.module.css";
import DefaultBtn from "@/components/ui/DefaultBtn.jsx";
import styles from "@/styles/Home.module.css";
import { logoutUser } from "@/services/AuthAndRegService.js";
import { useNavigate } from "react-router-dom";
import team_members from "@/features/ProjectPlanner/team/components/TeamMembers.module.css";
import search_members from "@/features/ProjectPlanner/team/components/SearchMembers.module.css";
import defaultAvatar from "@/assets/default_avatar.jpg";
import btn_styles from "@/components/ui/DefaultBtn.module.css";
import { MdCancel } from "react-icons/md";
import { toast } from "react-toastify";
import socket from "@/services/socket.js";
import { FaRegMoon, FaRegSun } from "react-icons/fa";
import { useTheme } from "@/context/ThemeContext.jsx";
import { IoArrowBack } from "react-icons/io5";
import DefaultInput from "@/components/ui/DefaultInput.jsx";
import input_styles from "@/components/ui/DefaultInput.module.css";
import { searchUsersByLogin } from "@/services/ProjectPlannerTeamService.js";

const AdminPanel = ({ onLogout }) => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const { theme, toggleTheme } = useTheme();
  const [queryForAdmin, setQueryForAdmin] = useState("");
  const [resultsForAdmin, setResultsForAdmin] = useState([]);

  useEffect(() => {
    if (queryForAdmin.trim() === "") {
      setResultsForAdmin([]);
      return;
    }

    const timeout = setTimeout(() => {
      searchUsersByLogin(queryForAdmin)
        .then(setResultsForAdmin)
        .catch((err) => {
          console.error("Ошибка при поиске пользователей:", err);
          setResultsForAdmin([]);
        });
    }, 300);

    return () => clearTimeout(timeout);
  }, [queryForAdmin]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch (error) {
        console.error("Ошибка загрузки пользователей:", error);
      }
    };

    fetchUsers();

    socket.on("userDeleted", fetchUsers);
    socket.on("userRegistered", fetchUsers);

    return () => {
      socket.off("userDeleted", fetchUsers);
      socket.off("userRegistered", fetchUsers);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      onLogout();
      navigate("/login");
    } catch (error) {
      console.error("Ошибка выхода:", error);
      toast.error("Не удалось выйти.");
    }
  };

  const handleDeleteUser = async (user) => {
    if (
      !window.confirm(
        "Вы уверены, что хотите удалить аккаунт данного пользователя?",
      )
    ) {
      return;
    }

    try {
      await deleteUserAccountByAdmin(user.id_user);
      setUsers((prevUsers) =>
        prevUsers.filter((u) => u.id_user !== user.id_user),
      );
      toast.success("Пользователь успешно удален");
    } catch (error) {
      console.error("Ошибка удаления аккаунта:", error);
      toast.error(error.message);
    }
  };

  const handleNavigateHome = () => {
    navigate("/home");
  };

  return (
    <div className={main_styles.page}>
      <div className={admin_styles.headerAdmin}>
        <h1>
          <RiAdminFill className={main_styles.titleIcon} />
          Панель администратора
        </h1>
        <div className={admin_styles.btnGroup}>
          <DefaultBtn
            onClick={handleNavigateHome}
            icon={IoArrowBack}
            className={btn_styles.roundCornersBtn}
          />
          <DefaultBtn
            onClick={toggleTheme}
            icon={theme === "dark" ? FaRegMoon : FaRegSun}
            className={btn_styles.roundCornersBtn}
          />
          <DefaultBtn onClick={handleLogout} variant="confirmBtn">
            Выйти
          </DefaultBtn>
        </div>
      </div>

      <hr className={styles.prettyHr} />

      <div className={admin_styles.adminContent}>
        <div className={admin_styles.userList}>
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
              <div className={admin_styles.deleteBtn}>
                <DefaultBtn
                  className={btn_styles.roundCornersBtn}
                  icon={MdCancel}
                  onClick={() => handleDeleteUser(user)}
                >
                  Удалить пользователя
                </DefaultBtn>
              </div>
            </div>
          ))}
        </div>
        <div className={admin_styles.searchList}>
          <p className={search_members.helpText}>Введите ник пользователя:</p>
          <DefaultInput
            value={queryForAdmin}
            maxLength={50}
            onChange={(e) => setQueryForAdmin(e.target.value)}
            placeholder="Поиск по нику..."
            className={`${input_styles.defaultInput} ${input_styles.searchMembersInput}`}
          />
          <div
            className={`${main_styles.moduleSection} ${search_members.searchSection}`}
          >
            {resultsForAdmin.length > 0 ? (
              resultsForAdmin
                .filter((user) => user.role !== "admin")
                .map((user) => {
                  return (
                    <div key={user.login} className={search_members.resultItem}>
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
                      <div className={admin_styles.deleteBtn}>
                        <DefaultBtn
                          className={btn_styles.roundCornersBtn}
                          icon={MdCancel}
                          onClick={() => handleDeleteUser(user)}
                        />
                      </div>
                    </div>
                  );
                })
            ) : queryForAdmin.trim() !== "" ? (
              <p className={search_members.noResults}>Ничего не найдено</p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
