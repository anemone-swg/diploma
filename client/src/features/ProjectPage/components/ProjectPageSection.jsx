import React from "react";
import project_page_styles from "@/styles/ProjectPage.module.css";
import { FaProjectDiagram } from "react-icons/fa";
import main_styles from "@/styles/App.module.css";
import kanban_board_section_styles from "@/features/ProjectPlanner/kanban/components/KanbanBoardSection.module.css";
import ProjectPageTeam from "@/features/ProjectPage/components/ProjectPageTeam.jsx";

const ProjectPageSection = ({ project, sidebarWidth, currentUserId }) => {
  return (
    <div>
      <h1 className={project_page_styles.title}>
        <FaProjectDiagram className={main_styles.titleIcon} />
        Проект: {project.title}
      </h1>
      <div>
        {project.teams &&
          project.teams.map((team) => (
            <div
              key={team.id_team}
              className={kanban_board_section_styles.boardContainer}
              style={{
                maxWidth: `calc(95vw - ${sidebarWidth}px)`,
              }}
            >
              <ProjectPageTeam team={team} currentUserId={currentUserId} />
            </div>
          ))}
      </div>
    </div>
  );
};

export default ProjectPageSection;
