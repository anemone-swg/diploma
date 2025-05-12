import React from "react";
import boards_container from "@/features/ProjectPlanner/kanban/components/BoardContainer.module.css";
import kanban_styles from "@/features/ProjectPlanner/kanban/styles/Kanban.module.css";
import btn_styles from "@/components/ui/DefaultBtn.module.css";
import project_page_styles from "@/styles/ProjectPage.module.css";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import DefaultBtn from "@/components/ui/DefaultBtn.jsx";
import ProjectPageColumn from "@/features/ProjectPage/components/ProjectPageColumn.jsx";
import { useCollapsedState } from "@/hooks/useCollapsedState.js";

const ProjectPageTeam = ({ setProject, team, currentUserId }) => {
  const [isCollapsed, setIsCollapsed] = useCollapsedState(team.id_team);

  return (
    <div>
      <div className={boards_container.board}>
        <div className={kanban_styles.elementHeader}>
          <h3 className={project_page_styles.titleInSection}>{team.title}</h3>
          <div className={boards_container.teamBtns}>
            <DefaultBtn
              onClick={() => setIsCollapsed((prev) => !prev)}
              className={btn_styles.roundCornersBtn}
              icon={isCollapsed ? FaChevronDown : FaChevronUp}
            ></DefaultBtn>
          </div>
        </div>

        <hr />

        <div
          className={`${boards_container.columnsContainer} ${isCollapsed ? boards_container.collapsed : ""}`}
        >
          {team.columns.map((column) => (
            <ProjectPageColumn
              setProject={setProject}
              column={column}
              key={column.id_column}
              currentUserId={currentUserId}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectPageTeam;
