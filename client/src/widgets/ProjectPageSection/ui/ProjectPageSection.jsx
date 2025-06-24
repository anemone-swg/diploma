import React from "react";
import { FaProjectDiagram } from "react-icons/fa";
import kanban_board_section_styles from "@/widgets/KanbanBoardSection/ui/KanbanBoardSection.module.css";
import ProjectPageTeam from "@/widgets/ProjectPageSection/ui/ui/ProjectPageTeam.jsx";
import PageTitle from "@/shared/ui/PageTitle.jsx";

const ProjectPageSection = ({ project, sidebarWidth, currentUserId }) => {
  return (
    <div>
      <PageTitle title={`Проект: ${project.title}`} icon={FaProjectDiagram} />
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
