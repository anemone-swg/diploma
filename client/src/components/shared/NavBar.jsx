import React, { useEffect, useState } from "react";
import main_styles from "../../styles/App.module.css";
import navbar_styles from "./NavBar.module.css";
import btn_styles from "../ui/DefaultBtn.module.css";
import { FaPlus, FaProjectDiagram, FaTrash, FaUsers } from "react-icons/fa";
import DefaultBtn from "../ui/DefaultBtn.jsx";
import { PiKanban } from "react-icons/pi";
import classNames from "classnames";
import { MdEmojiPeople } from "react-icons/md";
import { IoHomeOutline } from "react-icons/io5";

const NavBar = ({
  activeSection,
  boards,
  setActiveSection,
  setShowCreateModal,
  setShowDeleteModal,
  sidebarWidth,
}) => {
  const [isCompact, setIsCompact] = useState(window.innerWidth < 1200);

  useEffect(() => {
    const handleResize = () => {
      setIsCompact(window.innerWidth < 1200);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={navbar_styles.navbar} style={{ left: `${sidebarWidth}px` }}>
      <nav>
        <h1 className={navbar_styles.title}>
          <FaProjectDiagram className={main_styles.titleIcon} />
          Планировщик проектов / Kanban-доска
        </h1>
        <div className={navbar_styles.menu}>
          <div>
            <DefaultBtn
              icon={IoHomeOutline}
              active={activeSection === "main"}
              disabled={false}
              onClick={() => {
                setActiveSection("main");
              }}
            >
              {!isCompact && "Домашняя страница"}
            </DefaultBtn>
            <DefaultBtn
              icon={boards.length === 0 ? FaPlus : PiKanban}
              active={activeSection === "kanban"}
              onClick={() => {
                if (boards.length > 0) setActiveSection("kanban");
                else setShowCreateModal(true);
              }}
              disabled={false}
              className={
                activeSection === "kanban" ? btn_styles.activeDefaultBtn : ""
              }
            >
              {!isCompact &&
                (boards.length === 0 ? "Создать kanban-доску" : "Kanban-доска")}
            </DefaultBtn>

            <DefaultBtn
              icon={FaUsers}
              active={activeSection === "team"}
              onClick={() => setActiveSection("team")}
              disabled={boards.length === 0}
              className={classNames(
                { [btn_styles.disable]: boards.length === 0 },
                { [btn_styles.activeDefaultBtn]: activeSection === "team" },
              )}
            >
              {!isCompact && "Команда"}
            </DefaultBtn>
          </div>
          <div>
            <DefaultBtn
              icon={MdEmojiPeople}
              active={activeSection === "join"}
              onClick={() => {
                setActiveSection("join");
              }}
              style={boards.length === 0 ? { marginRight: "0" } : undefined}
            >
              {!isCompact && "Присоединиться к проекту"}
            </DefaultBtn>
            {boards.length !== 0 && (
              <DefaultBtn
                icon={FaTrash}
                onClick={() => setShowDeleteModal(true)}
                style={{ marginRight: "0" }}
              >
                {!isCompact && "Удалить kanban-доску"}
              </DefaultBtn>
            )}
          </div>
        </div>
      </nav>
      <hr />
    </div>
  );
};

export default NavBar;
