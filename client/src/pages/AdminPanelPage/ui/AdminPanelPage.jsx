import React, { useEffect, useState } from "react";
import {
  deleteUserAccountByAdmin,
  getAllUsers,
} from "@/services/AccountService.js";
import main_styles from "@/app/styles/App.module.css";
import { RiAdminFill } from "react-icons/ri";
import admin_styles from "@/pages/AdminPanelPage/ui/AdminPanelPage.module.css";
import DefaultBtn from "@/shared/ui/DefaultBtn.jsx";
import { logoutUser } from "@/services/AuthAndRegService.js";
import { useNavigate } from "react-router-dom";
import team_members from "@/widgets/TeamSection/ui/ui/TeamMembers.module.css";
import search_members from "@/widgets/TeamSection/ui/ui/SearchMembers.module.css";
import defaultAvatar from "@/shared/assets/default_avatar.jpg";
import btn_styles from "@/shared/ui/DefaultBtn.module.css";
import { MdCancel } from "react-icons/md";
import { toast } from "react-toastify";
import socket from "@/shared/lib/socket/socket.js";
import { FaRegMoon, FaRegSun } from "react-icons/fa";
import { useTheme } from "@/shared/lib/hooks/useTheme.js";
import { IoArrowBack } from "react-icons/io5";
import DefaultInput from "@/shared/ui/DefaultInput.jsx";
import input_styles from "@/shared/ui/DefaultInput.module.css";
import { searchUsersByLogin } from "@/services/ProjectPlannerTeamService.js";
import PageTitle from "@/shared/ui/PageTitle.jsx";

const AdminPanelPage = ({ onLogout }) => {
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
        .catch(() => {
          setResultsForAdmin([]);
        });
    }, 300);

    return () => clearTimeout(timeout);
  }, [queryForAdmin]);

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
  }, []);

  const handleLogout = () => {
    logoutUser().then(() => {
      onLogout();
      navigate("/login");
    });
  };

  const handleDeleteUser = (user) => {
    if (
      !window.confirm(
        "Вы уверены, что хотите удалить аккаунт данного пользователя?",
      )
    ) {
      return;
    }

    deleteUserAccountByAdmin(user.id_user)
      .then(() => {
        setUsers((prevUsers) =>
          prevUsers.filter((u) => u.id_user !== user.id_user),
        );
        toast.success("Пользователь успешно удален");
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const handleNavigateHome = () => {
    navigate("/home");
  };

  return (
    <div className={main_styles.page}>
      <div className={admin_styles.headerAdmin}>
        <PageTitle title={"Панель администратора"} icon={RiAdminFill} />
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

      <hr className={main_styles.prettyHr} />

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

export default AdminPanelPage;
