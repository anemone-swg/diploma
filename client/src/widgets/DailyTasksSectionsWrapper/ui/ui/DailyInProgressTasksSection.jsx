import React, { useEffect, useState } from "react";
import styles from "@/shared/lib/classNames/DailyTasksSections.module.css";
import additional_styles from "@/shared/lib/classNames/Additional.module.css";
import PageTitle from "@/shared/ui/PageTitle.jsx";
import { FaTasks } from "react-icons/fa";
// eslint-disable-next-line no-unused-vars
import { AnimatePresence } from "framer-motion";
import TaskInput from "@/features/TaskInput/ui/TaskInput.jsx";
import InProgressDailyTask from "@/entities/InProgressDailyTask/ui/InProgressDailyTask.jsx";

const DailyInProgressTasksSection = ({
  tasks,
  setTasks,
  onDeleteTask,
  onToggleTask,
}) => {
  const [taskDescriptionMap, setTaskDescriptionMap] = useState({});
  const inProgressTasks = tasks.filter((task) => !task.completed);

  useEffect(() => {
    const initialDescriptions = {};
    const initialTitles = {};
    tasks.forEach((task) => {
      initialDescriptions[task.id_task] = task.description || "";
      initialTitles[task.id_task] = task.title || "";
    });
    setTaskDescriptionMap(initialDescriptions);
  }, [tasks]);

  return (
    <div className={styles.taskSection}>
      <PageTitle title={"Список задач"} icon={FaTasks} />
      <hr className={styles.gradientHr} />

      <TaskInput
        setTasks={setTasks}
        setTaskDescriptionMap={setTaskDescriptionMap}
      />

      {inProgressTasks.length === 0 ? (
        <div className={styles.noTasks}>
          <p>Задач пока нет</p>
        </div>
      ) : (
        <ul className={`${styles.taskList} ${additional_styles.moduleSection}`}>
          <AnimatePresence>
            {inProgressTasks.map((task) => (
              <InProgressDailyTask
                key={task.id_task}
                setTasks={setTasks}
                task={task}
                taskDescriptionMap={taskDescriptionMap}
                setTaskDescriptionMap={setTaskDescriptionMap}
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

export default DailyInProgressTasksSection;
