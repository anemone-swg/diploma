import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import main_styles from "../styles/App.module.css";
import styles from "../styles/DailyTasks.module.css";
import {
  fetchTasks,
  addTask,
  updateDueDate,
  updateTaskDescription,
  deleteTask,
  toggleTaskStatus,
} from "../services/DailyTaskService.js";

const DailyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [taskDescriptionMap, setTaskDescriptionMap] = useState({});
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    fetchTasks().then((data) => {
      setTasks(data);
      const initialDescriptions = {};
      data.forEach((task) => {
        initialDescriptions[task.id_task] = task.description || "";
      });
      setTaskDescriptionMap(initialDescriptions);
    });
  }, []);

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      addTask(newTaskTitle, dueDate).then((newTask) => {
        if (newTask) {
          setTasks((prev) => [
            ...prev,
            { ...newTask, description: "", completed: false },
          ]);
          setNewTaskTitle("");
          setDueDate("");
          setTaskDescriptionMap((prev) => ({
            ...prev,
            [newTask.id_task]: "",
          }));
        }
      });
    }
  };

  const handleToggleCompleted = async (taskId) => {
    const updatedTasks = tasks.map((task) =>
      task.id_task === taskId ? { ...task, completed: !task.completed } : task,
    );
    setTasks(updatedTasks);

    const success = await toggleTaskStatus(taskId);
    if (!success) {
      setTasks(tasks); // откат на прежнее значение
    }
  };

  const handleDeleteTask = (id_task) => {
    deleteTask(id_task).then((success) => {
      if (success) {
        setTasks((prev) => prev.filter((task) => task.id_task !== id_task));
      }
    });
  };

  const handleDescriptionChange = (id_task, newDesc) => {
    setTaskDescriptionMap({ ...taskDescriptionMap, [id_task]: newDesc });
  };

  const handleSaveDescription = (id_task) => {
    const newDescription = taskDescriptionMap[id_task];
    const updatedTasks = tasks.map((task) =>
      task.id_task === id_task
        ? { ...task, description: newDescription }
        : task,
    );
    setTasks(updatedTasks);
    updateTaskDescription(id_task, newDescription);
  };

  const formatLocalDateTime = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const inProgressTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  return (
    <div className={main_styles.page}>
      <div className={styles.taskSectionsWrapper}>
        {/* ЗАДАЧИ В ПРОЦЕССЕ */}
        <div className={styles.taskSection}>
          <h1>Список задач</h1>
          <hr className={styles.gradientHr} />

          <div className={`${styles.taskInput} ${main_styles.moduleSection}`}>
            <label>
              Название задачи:
              <input
                type="text"
                className={styles.myInput}
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
              />
            </label>

            <label>
              Дата выполнения:
              <input
                type="datetime-local"
                className={styles.myInput}
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </label>

            <button
              className={main_styles.defaultButton}
              onClick={handleAddTask}
            >
              Добавить
            </button>
          </div>

          {inProgressTasks.length === 0 ? (
            <div className={styles.noTasks}>
              <p>Задач пока нет</p>
            </div>
          ) : (
            <ul className={`${styles.taskList} ${main_styles.moduleSection}`}>
              <AnimatePresence>
                {inProgressTasks.map((task) => (
                  <motion.li
                    key={task.id_task}
                    className={`${styles.taskItem}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className={styles.taskTitleWithButton}>
                      <span>{task.title}</span>
                      <button
                        className={styles.completeButton}
                        onClick={() => handleToggleCompleted(task.id_task)}
                      >
                        Выполнить
                      </button>
                    </div>
                    <hr className={styles.taskSeparator} />

                    <div className={styles.taskDates}>
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

                    <div className={styles.descriptionBlock}>
                      <textarea
                        className={styles.descriptionArea}
                        placeholder="Введите описание..."
                        value={taskDescriptionMap[task.id_task] || ""}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) =>
                          handleDescriptionChange(task.id_task, e.target.value)
                        }
                      />
                      <button
                        className={main_styles.defaultButton}
                        onClick={() => handleSaveDescription(task.id_task)}
                      >
                        Добавить описание
                      </button>
                    </div>

                    <div className={styles.descriptionBlock}>
                      <label>
                        <span>Изменить дату выполнения:</span>
                        <input
                          type="datetime-local"
                          className={styles.myInput}
                          value={
                            task.due_date
                              ? formatLocalDateTime(task.due_date)
                              : ""
                          }
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => {
                            const updatedDueDate = e.target.value;
                            setTasks((prevTasks) =>
                              prevTasks.map((t) =>
                                t.id_task === task.id_task
                                  ? { ...t, due_date: updatedDueDate }
                                  : t,
                              ),
                            );
                            updateDueDate(task.id_task, updatedDueDate);
                          }}
                        />
                      </label>
                      <button
                        className={`${main_styles.defaultButton} ${main_styles.exitDeleteButton} ${styles.deleteButton}`}
                        onClick={() => handleDeleteTask(task.id_task)}
                      >
                        Удалить заметку
                      </button>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </div>

        {/* ВЫПОЛНЕННЫЕ ЗАДАЧИ */}
        <div className={styles.taskSection}>
          <h1>Выполненные задачи</h1>
          <hr className={styles.gradientHr} />

          {completedTasks.length === 0 ? (
            <div className={styles.noTasks}>
              <p>Нет выполненных задач</p>
            </div>
          ) : (
            <ul className={`${styles.taskList} ${main_styles.moduleSection}`}>
              <AnimatePresence>
                {completedTasks.map((task) => (
                  <motion.li
                    key={task.id_task}
                    className={`${styles.taskItem} ${styles.completed}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className={styles.taskTitleWithButton}>
                      <span>{task.title}</span>
                      <button
                        className={styles.completeButton}
                        onClick={() => handleToggleCompleted(task.id_task)}
                      >
                        Выполнено
                      </button>
                    </div>
                    <hr className={styles.taskSeparator} />

                    <div className={styles.taskDates}>
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
                        <button
                          className={`${main_styles.defaultButton} ${main_styles.exitDeleteButton}`}
                          onClick={() => handleDeleteTask(task.id_task)}
                        >
                          Удалить заметку
                        </button>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default DailyTasks;
