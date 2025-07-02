import React from "react";
import task_styles from "@/shared/lib/classNames/DailyTasks.module.css";
import styles from "@/entities/CompletedDailyTask/ui/CompletedDailyTask.module.css";
import DefaultBtn from "@/shared/ui/DefaultBtn.jsx";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const CompletedDailyTask = ({ task, onDeleteTask, onToggleTask }) => {
  return (
    <motion.li
      key={task.id_task}
      className={`${task_styles.taskItem} ${styles.completed}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
    >
      <div className={task_styles.taskTitleWithButton}>
        <span className={styles.titleCompleteTask}>{task.title}</span>
        <DefaultBtn
          variant={"confirmBtn"}
          onClick={() => onToggleTask(task.id_task)}
        >
          Выполнено
        </DefaultBtn>
      </div>
      <hr className={task_styles.taskSeparator} />

      <div className={task_styles.taskDates}>
        <span>
          Дата создания:{" "}
          {new Date(task.created_at).toLocaleString("ru-RU", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
        {task.due_date && (
          <span>
            {" "}
            | Дата выполнения:{" "}
            {new Date(task.due_date).toLocaleString("ru-RU", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        )}
      </div>
      <div className={styles.completeTaskBody}>
        {task.description && (
          <div>
            <h3>Описание:</h3>
            <p>{task.description}</p>
          </div>
        )}
        <div className={`${styles.deleteButtonBody}`}>
          <DefaultBtn
            variant={"exitDeleteBtn"}
            onClick={() => onDeleteTask(task.id_task)}
          >
            Удалить заметку
          </DefaultBtn>
        </div>
      </div>
    </motion.li>
  );
};

export default CompletedDailyTask;
