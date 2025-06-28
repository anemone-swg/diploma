import React, { useEffect, useState } from "react";
import navbar_styles from "@/widgets/Navbar/ui/NavBar.module.css";
import { FaPlus, FaProjectDiagram, FaTrash, FaUsers } from "react-icons/fa";
import DefaultBtn from "@/shared/ui/DefaultBtn.jsx";
import { PiKanban } from "react-icons/pi";
import { MdEmojiPeople } from "react-icons/md";
import { IoHomeOutline } from "react-icons/io5";
import { BiTask } from "react-icons/bi";
import PageTitle from "@/shared/ui/PageTitle.jsx";

const NavBar = ({
  activeSection,
  boards,
  setActiveSection,
  setShowCreateModal,
  setShowDeleteModal,
  sidebarWidth,
}) => {
  const [isCompact, setIsCompact] = useState(window.innerWidth < 1300);

  useEffect(() => {
    const handleResize = () => {
      setIsCompact(window.innerWidth < 1300);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={navbar_styles.navbar} style={{ left: `${sidebarWidth}px` }}>
      <nav>
        <PageTitle
          className={navbar_styles.title}
          title={"Планировщик проектов / Kanban-доска"}
          icon={FaProjectDiagram}
        />
        <div className={navbar_styles.menu}>
          <div>
            <DefaultBtn
              variant="navbarNoRoundCornersBtn"
              svgMargin={!isCompact}
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
              svgMargin={!isCompact}
              variant="navbarNoRoundCornersBtn"
              icon={boards.length === 0 ? FaPlus : PiKanban}
              active={activeSection === "kanban"}
              onClick={() => {
                if (boards.length > 0) setActiveSection("kanban");
                else setShowCreateModal(true);
              }}
            >
              {!isCompact &&
                (boards.length === 0 ? "Создать kanban-доску" : "Kanban-доска")}
            </DefaultBtn>

            <DefaultBtn
              svgMargin={!isCompact}
              variant="navbarNoRoundCornersBtn"
              icon={FaUsers}
              active={activeSection === "team"}
              onClick={() => setActiveSection("team")}
              disabled={boards.length === 0}
            >
              {!isCompact && "Команда"}
            </DefaultBtn>

            <DefaultBtn
              svgMargin={!isCompact}
              variant="navbarNoRoundCornersBtn"
              icon={BiTask}
              active={activeSection === "tasks"}
              onClick={() => setActiveSection("tasks")}
              disabled={boards.length === 0}
            >
              {!isCompact && "Задачи"}
            </DefaultBtn>
          </div>
          <div>
            <DefaultBtn
              svgMargin={!isCompact}
              variant="navbarNoRoundCornersBtn"
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
                svgMargin={!isCompact}
                variant="navbarNoRoundCornersBtn"
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
