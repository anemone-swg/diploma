import React from "react";
import task_styles from "@/features/ProjectPlanner/kanban/components/KanbanTask.module.css";
import team_members from "@/features/ProjectPlanner/team/components/TeamMembers.module.css";
import search_members from "@/features/ProjectPlanner/team/components/SearchMembers.module.css";
import defaultAvatar from "@/assets/default_avatar.jpg";
import project_page_styles from "@/styles/ProjectPage.module.css";
import ReadOnlyDeadlineDatePicker from "@/components/ui/ReadOnlyDeadlineDatePicker.jsx";
import btn_styles from "@/components/ui/DefaultBtn.module.css";
import DefaultBtn from "@/components/ui/DefaultBtn.jsx";
import { taskStatusChange } from "@/services/ProjectPlannerService.js";
import { RiProgress3Line } from "react-icons/ri";

const ProjectPageTask = ({ task, currentUserId }) => {
  const isUserAssigned = task.assignedUsers?.some(
    (user) => user.id_user === currentUserId,
  );

  const handleTaskStatusChange = async (taskId) => {
    await taskStatusChange(taskId);
  };

  return (
    <div className={`${task_styles.task} ${task_styles.taskBody}`}>
      <div className={project_page_styles.taskHeader}>
        <h3 className={project_page_styles.titleInSection}>{task.content}</h3>
      </div>

      <div className={project_page_styles.taskUser}>
        {task.assignedUsers && task.assignedUsers.length > 0 ? (
          <div>
            {task.assignedUsers.map((user) => (
              <div key={user.id_user} className={team_members.memberOfTeam}>
                <img
                  className={search_members.userAvatar}
                  src={user.avatar || defaultAvatar}
                  alt="Аватар"
                />
                <div>
                  <p>
                    <strong>{user.login}</strong>
                  </p>
                  <p className={search_members.userNameInfo}>
                    {user.firstName} {user.lastName}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>Пользователи не назначены</p>
        )}
      </div>

      <div className={task_styles.taskDeadlineAndCompletedStatus}>
        <div className={task_styles.deadlinePicker}>
          {!task.deadline && (
            <span className={task_styles.noTimeMessage}>Задача без срока</span>
          )}
          {task.deadline && (
            <ReadOnlyDeadlineDatePicker value={task.deadline} />
          )}
        </div>
        {isUserAssigned && (
          <DefaultBtn
            icon={task.completed === "awaiting_approval" && RiProgress3Line}
            className={`${btn_styles.roundCornersBtn} ${btn_styles.noSvgMargin}`}
            onClick={() => handleTaskStatusChange(task.id_task)}
            visibleDisabled={task.completed === "done"}
          >
            {task.completed === "done"
              ? "Выполнено"
              : task.completed === "awaiting_approval"
                ? ""
                : "Выполнить"}
          </DefaultBtn>
        )}
      </div>
    </div>
  );
};

export default ProjectPageTask;
