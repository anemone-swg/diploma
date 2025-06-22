import React from "react";
import team_section from "@/widgets/TeamSection/ui/TeamSection.module.css";
import ProjectPageTask from "@/widgets/ProjectPageSection/ui/ui/ProjectPageTask.jsx";
import tasks_section_styles from "@/widgets/TasksSection/ui/TasksSection.module.css";
import DefaultBtn from "@/shared/ui/DefaultBtn.jsx";
import { RiProgress3Line } from "react-icons/ri";
import btn_styles from "@/shared/ui/DefaultBtn.module.css";
import { taskStatusChange } from "@/services/ProjectPlannerService.js";
import { MdAddTask } from "react-icons/md";
import main_styles from "@/app/styles/App.module.css";

const TasksSection = ({ boards }) => {
  const awaitingApprovalTasks = boards.flatMap((board) =>
    board.teams.flatMap((team) =>
      team.columns.flatMap((column) =>
        column.tasks.filter((task) => task.completed === "awaiting_approval"),
      ),
    ),
  );

  const handleTaskStatusChange = (taskId) => {
    taskStatusChange(taskId).then(() => {});
  };

  return (
    <div>
      <h2 className={team_section.teamPageTitle}>
        <MdAddTask className={main_styles.icon} /> Задачи, ожидающие
        подтверждения
      </h2>
      <div className={tasks_section_styles.awaiting_tasks}>
        {awaitingApprovalTasks.length === 0 && <p>Задачи отсутствуют.</p>}
        {awaitingApprovalTasks.map((task) => (
          <div
            className={tasks_section_styles.awaiting_task}
            key={task.id_task}
          >
            <ProjectPageTask task={task} />
            <DefaultBtn
              variant="confirmBtn"
              icon={task.completed === "awaiting_approval" && RiProgress3Line}
              className={`${btn_styles.roundCornersBtn} ${btn_styles.noSvgMargin}`}
              onClick={() => handleTaskStatusChange(task.id_task)}
            >
              {task.completed === "done"
                ? "Выполнено"
                : task.completed === "awaiting_approval"
                  ? ""
                  : "Выполнить"}
            </DefaultBtn>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TasksSection;
