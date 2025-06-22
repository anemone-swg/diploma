import React, { useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "framer-motion";
import main_styles from "@/app/styles/App.module.css";
import styles from "@/pages/DailyTasksPage/ui/DailyTasksPage.module.css";
import {
  addTask,
  deleteTask,
  fetchTasks,
  toggleTaskStatus,
  updateDueDate,
  updateTaskDescription,
  updateTaskTitle,
} from "@/services/DailyTaskService.js";
import { FaEdit, FaTasks } from "react-icons/fa";
import DeadlineDateTimePicker from "@/shared/ui/DeadlineDateTimePicker.jsx";

const DailyTasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [taskDescriptionMap, setTaskDescriptionMap] = useState({});
  const [dueDate, setDueDate] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [taskTitleMap, setTaskTitleMap] = useState({});

  useEffect(() => {
    fetchTasks().then((data) => {
      setTasks(data);
      const initialDescriptions = {};
      const initialTitles = {};
      data.forEach((task) => {
        initialDescriptions[task.id_task] = task.description || "";
        initialTitles[task.id_task] = task.title || "";
      });
      setTaskDescriptionMap(initialDescriptions);
      setTaskTitleMap(initialTitles);
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

  const handleDescriptionChange = (id_task, newDesc) => {
    setTaskDescriptionMap({ ...taskDescriptionMap, [id_task]: newDesc });
  };

  const handleSaveDescription = (id_task) => {
    const newDescription = taskDescriptionMap[id_task];
    updateTaskDescription(id_task, newDescription).then(() => {
      const updatedTasks = tasks.map((task) =>
        task.id_task === id_task
          ? { ...task, description: newDescription }
          : task,
      );
      setTasks(updatedTasks);
    });
  };

  const handleTitleChange = (id_task, newTitle) => {
    updateTaskTitle(id_task, newTitle).then(() => {
      const updatedTasks = tasks.map((task) =>
        task.id_task === id_task ? { ...task, title: newTitle } : task,
      );
      setTasks(updatedTasks);
    });
  };

  const inProgressTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  return (
    <div className={main_styles.page}>
      <div className={styles.taskSectionsWrapper}>
        {/* ЗАДАЧИ В ПРОЦЕССЕ */}
        <div className={styles.taskSection}>
          <h1>
            <FaTasks className={main_styles.titleIcon} />
            Список задач
          </h1>
          <hr className={styles.gradientHr} />

          <div className={`${styles.taskInput} ${main_styles.moduleSection}`}>
            <label className={styles.myLabel}>
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
              <DeadlineDateTimePicker
                value={dueDate ? new Date(dueDate) : null}
                onChange={(newDate) => {
                  if (newDate) {
                    setDueDate(newDate.toISOString());
                  } else {
                    setDueDate(null);
                  }
                }}
                mode={"choose"}
              />
            </label>

            <button
              className={`${main_styles.defaultButton} ${styles.taskInputButton}`}
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
                      {editingTaskId === task.id_task ? (
                        <input
                          maxLength={100}
                          autoFocus
                          type="text"
                          className={styles.myInput}
                          value={taskTitleMap[task.id_task] || ""}
                          onChange={(e) => {
                            if (e.target.value.trim()) {
                              setTaskTitleMap({
                                ...taskTitleMap,
                                [task.id_task]: e.target.value,
                              });
                              handleTitleChange(task.id_task, e.target.value);
                            }
                          }}
                          onBlur={() => setEditingTaskId(null)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              setEditingTaskId(null);
                            }
                            if (e.key === "Escape") {
                              setEditingTaskId(null);
                            }
                          }}
                        />
                      ) : (
                        <span
                          className={styles.titleTask}
                          onClick={() => setEditingTaskId(task.id_task)}
                        >
                          <FaEdit style={{ verticalAlign: "top" }} />{" "}
                          {taskTitleMap[task.id_task] || task.title}
                        </span>
                      )}

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
                        className={`${styles.descriptionArea} ${
                          (task.description || "") !==
                          (taskDescriptionMap[task.id_task] || "")
                            ? styles.unsaved
                            : ""
                        }`}
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
                      <div className={styles.deadlineBlock}>
                        <label>
                          <div>
                            <span>Изменить дату выполнения:</span>
                          </div>
                          <DeadlineDateTimePicker
                            value={
                              task.due_date ? new Date(task.due_date) : null
                            }
                            onChange={(newDate) => {
                              const updatedDueDate = newDate
                                ? newDate.toISOString()
                                : null;
                              updateDueDate(task.id_task, updatedDueDate).then(
                                () => {
                                  setTasks((prevTasks) =>
                                    prevTasks.map((t) =>
                                      t.id_task === task.id_task
                                        ? { ...t, due_date: updatedDueDate }
                                        : t,
                                    ),
                                  );
                                },
                              );
                            }}
                            mode={"change"}
                          />
                        </label>
                      </div>
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
          <h1 style={{ whiteSpace: "nowrap" }}>
            <FaTasks className={main_styles.titleIcon} />
            Выполненные задачи
          </h1>
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
                      <span className={styles.titleCompleteTask}>
                        {task.title}
                      </span>
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

export default DailyTasksPage;
