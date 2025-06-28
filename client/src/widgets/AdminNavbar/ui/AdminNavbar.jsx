import React from "react";
import styles from "@/shared/lib/classNames/Additional.module.css";
import admin_styles from "@/widgets/AdminNavbar/ui/AdminNavbar.module.css";
import PageTitle from "@/shared/ui/PageTitle.jsx";
import { RiAdminFill } from "react-icons/ri";
import DefaultBtn from "@/shared/ui/DefaultBtn.jsx";
import { IoArrowBack } from "react-icons/io5";
import { FaRegMoon, FaRegSun } from "react-icons/fa";
import { useTheme } from "@/shared/lib/hooks/useTheme.js";
import { logoutUser } from "@/entities/User/api/logout.js";
import { useNavigate } from "react-router-dom";

const AdminNavbar = ({ onLogout }) => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser().then(() => {
      onLogout();
      navigate("/login");
    });
  };

  const handleNavigateHome = () => {
    navigate("/home");
  };

  return (
    <>
      <div className={admin_styles.headerAdmin}>
        <PageTitle title={"Панель администратора"} icon={RiAdminFill} />
        <div className={admin_styles.btnGroup}>
          <DefaultBtn onClick={handleNavigateHome} icon={IoArrowBack} />
          <DefaultBtn
            onClick={toggleTheme}
            icon={theme === "dark" ? FaRegMoon : FaRegSun}
          />
          <DefaultBtn onClick={handleLogout} variant="confirmBtn">
            Выйти
          </DefaultBtn>
        </div>
      </div>

      <hr className={styles.prettyHr} />
    </>
  );
};

export default AdminNavbar;
