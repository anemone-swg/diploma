import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaHome, FaTasks, FaProjectDiagram } from "react-icons/fa";
import styles from "./Sidebar.module.css";

const Sidebar = ({ onResize }) => {
  const [width, setWidth] = useState(250); // Начальная ширина

  useEffect(() => {
    const savedWidth = localStorage.getItem("sidebarWidth");
    if (savedWidth) {
      setWidth(parseInt(savedWidth, 10));
      onResize(parseInt(savedWidth, 10));
    } else {
      onResize(width);
    }
  }, []);

  // Функция для начала перетаскивания
  const startResizing = (e) => {
    e.preventDefault();
    document.addEventListener("mousemove", onResizing);
    document.addEventListener("mouseup", stopResizing);
  };

  // Изменение ширины
  const onResizing = (e) => {
    const newWidth = Math.max(155, Math.min(e.clientX, 350));
    setWidth(newWidth);
    onResize(newWidth); // <- вот тут
    localStorage.setItem("sidebarWidth", newWidth);
  };

  // Остановка изменения ширины
  const stopResizing = () => {
    document.removeEventListener("mousemove", onResizing);
    document.removeEventListener("mouseup", stopResizing);
  };

  return (
    <div className={styles.sidebar} style={{ width: `${width}px` }}>
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
      {/* Ползунок для изменения размера */}
      <div className={styles.resizer} onMouseDown={startResizing}></div>
    </div>
  );
};

export default Sidebar;
