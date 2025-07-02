import React, { useEffect, useState } from "react";
import styles from "@/widgets/DailyTasksSectionsWrapper/ui/DailyTasksSectionsWrapper.module.css";
import DailyInProgressTasksSection from "@/widgets/DailyTasksSectionsWrapper/ui/ui/DailyInProgressTasksSection.jsx";
import DailyCompletedTasksSection from "@/widgets/DailyTasksSectionsWrapper/ui/ui/DailyCompletedTasksSection.jsx";
import { fetchTasks } from "@/entities/DailyTask/api/fetchTasks.js";
import { toggleTaskStatus } from "@/entities/DailyTask/api/toggleTaskStatus.js";
import { deleteTask } from "@/entities/DailyTask/api/deleteTask.js";

const DailyTasksSectionsWrapper = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks().then((data) => {
      setTasks(data);
    });
  }, []);

  const handleToggleCompleted = (taskId) => {
    toggleTaskStatus(taskId).then(() => {
      const updatedTasks = tasks.map((task) =>
        task.id_task === taskId
          ? { ...task, completed: !task.completed }
          : task,
      );
      setTasks(updatedTasks);
    });
  };

  const handleDeleteTask = (id_task) => {
    deleteTask(id_task).then(() => {
      setTasks((prev) => prev.filter((task) => task.id_task !== id_task));
    });
  };

  return (
    <div className={styles.taskSectionsWrapper}>
      <DailyInProgressTasksSection
        tasks={tasks}
        setTasks={setTasks}
        onDeleteTask={handleDeleteTask}
        onToggleTask={handleToggleCompleted}
      />
      <DailyCompletedTasksSection
        tasks={tasks}
        onDeleteTask={handleDeleteTask}
        onToggleTask={handleToggleCompleted}
      />
    </div>
  );
};

export default DailyTasksSectionsWrapper;
