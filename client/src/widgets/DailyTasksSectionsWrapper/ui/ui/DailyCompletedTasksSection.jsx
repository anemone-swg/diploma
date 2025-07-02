import React from "react";
import styles from "@/shared/lib/classNames/DailyTasksSections.module.css";
import additional_styles from "@/shared/lib/classNames/Additional.module.css";
import PageTitle from "@/shared/ui/PageTitle.jsx";
import { FaTasks } from "react-icons/fa";
import { AnimatePresence } from "framer-motion";
import CompletedDailyTask from "@/entities/CompletedDailyTask/ui/CompletedDailyTask.jsx";

const DailyCompletedTasksSection = ({ tasks, onDeleteTask, onToggleTask }) => {
  const completedTasks = tasks.filter((task) => task.completed);

  return (
    <div className={styles.taskSection}>
      <PageTitle
        className={styles.taskNoWrapHeader}
        title={"Выполненные задачи"}
        icon={FaTasks}
      />
      <hr className={styles.gradientHr} />

      {completedTasks.length === 0 ? (
        <div className={styles.noTasks}>
          <p>Нет выполненных задач</p>
        </div>
      ) : (
        <ul className={`${styles.taskList} ${additional_styles.moduleSection}`}>
          <AnimatePresence>
            {completedTasks.map((task) => (
              <CompletedDailyTask
                key={task.id_task}
                task={task}
                onDeleteTask={onDeleteTask}
                onToggleTask={onToggleTask}
              />
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
};

export default DailyCompletedTasksSection;
