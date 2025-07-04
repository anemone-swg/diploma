import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaProjectDiagram,
  FaRegMoon,
  FaRegSun,
  FaTasks,
} from "react-icons/fa";
import styles from "@/widgets/Sidebar/ui/Sidebar.module.css";
import DefaultBtn from "@/shared/ui/DefaultBtn.jsx";
import btn_styles from "@/shared/ui/DefaultBtn.module.css";
import { useTheme } from "@/shared/lib/hooks/useTheme.js";
import { RiAdminFill } from "react-icons/ri";

const Sidebar = ({ onResize, sidebarWidth, setSidebarWidth, userRole }) => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const savedWidth = localStorage.getItem("sidebarWidth");
    if (savedWidth) {
      setSidebarWidth(parseInt(savedWidth, 10));
      onResize(parseInt(savedWidth, 10));
    } else {
      onResize(sidebarWidth);
    }
  }, [onResize, setSidebarWidth, sidebarWidth]);

  // Функция для начала перетаскивания
  const startResizing = (e) => {
    e.preventDefault();
    document.addEventListener("mousemove", onResizing);
    document.addEventListener("mouseup", stopResizing);
  };

  // Изменение ширины
  const onResizing = (e) => {
    const newWidth = Math.max(155, Math.min(e.clientX, 240));
    setSidebarWidth(newWidth);
    onResize(newWidth); // <- вот тут
    localStorage.setItem("sidebarWidth", newWidth);
  };

  // Остановка изменения ширины
  const stopResizing = () => {
    document.removeEventListener("mousemove", onResizing);
    document.removeEventListener("mouseup", stopResizing);
  };

  const handleNavigateAdminPanel = () => {
    navigate("/admin");
  };

  return (
    <div className={styles.sidebar} style={{ width: `${sidebarWidth}px` }}>
      <h1 className={styles.nameProject}>TASKLY</h1>
      <hr className={styles.hrNameProject} />
      <div className={styles.sidebarContent}>
        <div>
          <ul>
            <li>
              <Link to="/">
                <FaHome className={styles.icon} /> Домашняя страница
              </Link>
            </li>
            <li>
              <Link to="/daily-tasks">
                <FaTasks className={styles.icon} />
                Список задач
              </Link>
            </li>
            <li>
              <Link to="/project-planner">
                <FaProjectDiagram className={styles.icon} />
                Планировщик проектов
              </Link>
            </li>
          </ul>
        </div>
        <div className={styles.bottomSection}>
          {userRole === "admin" && (
            <DefaultBtn
              icon={RiAdminFill}
              onClick={handleNavigateAdminPanel}
              className={btn_styles.roundCornersBtn}
            />
          )}
          <DefaultBtn
            onClick={toggleTheme}
            icon={theme === "dark" ? FaRegMoon : FaRegSun}
            className={btn_styles.roundCornersBtn}
          />
        </div>
      </div>

      <div className={styles.resizer} onMouseDown={startResizing}></div>
    </div>
  );
};

export default Sidebar;
