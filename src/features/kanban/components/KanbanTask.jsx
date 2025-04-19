import React from "react";
import task_styles from "./KanbanTask.module.css";

const KanbanTask = ({ task }) => {
  return (
    <div className={task_styles.task}>
      <>
        <div className={task_styles.taskContent}>{task.content}</div>
      </>
    </div>
  );
};

export default KanbanTask;
