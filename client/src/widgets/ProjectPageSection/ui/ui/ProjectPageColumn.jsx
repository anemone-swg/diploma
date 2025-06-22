import React from "react";
import column_styles from "@/widgets/KanbanBoardSection/ui/ui/KanbanColumn.module.css";
import kanban_styles from "@/app/styles/Kanban.module.css";
import ProjectPageTask from "@/widgets/ProjectPageSection/ui/ui/ProjectPageTask.jsx";
import project_page_styles from "@/pages/ProjectPage/ui/ProjectPage.module.css";
import { useTheme } from "@/shared/lib/hooks/useTheme.js";
import { columnColors } from "@/shared/constants/columnColors.js";

const ProjectPageColumn = ({ column, currentUserId }) => {
  const { theme } = useTheme();

  const resolvedColor =
    columnColors[theme][column.color] || columnColors[theme].default;

  const isPastelColor = resolvedColor !== "var(--background-color)";

  return (
    <div
      className={column_styles.column}
      style={{ backgroundColor: resolvedColor }}
    >
      <div
        className={`${kanban_styles.elementHeader} ${
          isPastelColor ? project_page_styles.pastel : ""
        }`}
      >
        <h3 className={project_page_styles.titleInSection}>{column.title}</h3>
      </div>

      <hr
        style={{
          borderTop: isPastelColor
            ? "2px solid var(--text-color-dark)"
            : "2px solid var(--text-color)",
        }}
      />

      <div className={column_styles.taskContainer}>
        {column.tasks.map((task) => (
          <ProjectPageTask
            key={task.id_task}
            task={task}
            currentUserId={currentUserId}
          />
        ))}
      </div>
    </div>
  );
};

export default ProjectPageColumn;
