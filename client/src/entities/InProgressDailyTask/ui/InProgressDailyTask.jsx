import React, { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { FaEdit } from "react-icons/fa";
import styles from "@/shared/lib/classNames/DailyTasks.module.css";
import task_styles from "@/entities/InProgressDailyTask/ui/InProgressDailyTask.module.css";
import DefaultInput from "@/shared/ui/DefaultInput.jsx";
import DefaultBtn from "@/shared/ui/DefaultBtn.jsx";
import DeadlineDateTimePicker from "@/shared/ui/DeadlineDateTimePicker.jsx";
import { updateTaskTitle } from "@/entities/InProgressDailyTask/api/updateTaskTitle.js";
import { updateTaskDescription } from "@/entities/InProgressDailyTask/api/updateTaskDescription.js";
import { updateDueDate } from "@/entities/InProgressDailyTask/api/updateDueDate.js";

const InProgressDailyTask = ({
  setTasks,
  task,
  taskDescriptionMap,
  setTaskDescriptionMap,
  onDeleteTask,
  onToggleTask,
}) => {
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");

  const handleTitleChange = (id_task, newTitle) => {
    updateTaskTitle(id_task, newTitle).then(() => {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id_task === id_task ? { ...task, title: newTitle } : task,
        ),
      );
    });
  };

  const handleDescriptionChange = (id_task, newDesc) => {
    setTaskDescriptionMap({ ...taskDescriptionMap, [id_task]: newDesc });
  };

  const handleSaveDescription = (id_task) => {
    const newDescription = taskDescriptionMap[id_task];
    updateTaskDescription(id_task, newDescription).then(() => {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id_task === id_task
            ? { ...task, description: newDescription }
            : task,
        ),
      );
    });
  };

  const handleDeadlineChange = (id_task, newDate) => {
    const updatedDueDate = newDate ? newDate.toISOString() : null;
    updateDueDate(id_task, updatedDueDate).then(() => {
      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t.id_task === id_task ? { ...t, due_date: updatedDueDate } : t,
        ),
      );
    });
  };

  return (
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
          <DefaultInput
            maxLength={100}
            autoFocus
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onBlur={() => {
              if (editedTitle.trim() && editedTitle !== task.title) {
                handleTitleChange(task.id_task, editedTitle);
              }
              setEditingTaskId(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (editedTitle.trim() && editedTitle !== task.title) {
                  handleTitleChange(task.id_task, editedTitle);
                }
                setEditingTaskId(null);
              }
              if (e.key === "Escape") {
                setEditingTaskId(null);
              }
            }}
          />
        ) : (
          <span
            className={task_styles.titleTask}
            onClick={() => {
              setEditingTaskId(task.id_task);
              setEditedTitle(task.title);
            }}
          >
            <FaEdit style={{ verticalAlign: "top" }} /> {task.title}
          </span>
        )}

        <DefaultBtn
          variant={"confirmBtn"}
          onClick={() => onToggleTask(task.id_task)}
        >
          Выполнить
        </DefaultBtn>
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

      <div className={task_styles.descriptionBlock}>
        <textarea
          className={`${task_styles.descriptionArea} ${
            (task.description || "") !==
            (taskDescriptionMap[task.id_task] || "")
              ? task_styles.unsaved
              : ""
          }`}
          placeholder="Введите описание..."
          value={taskDescriptionMap[task.id_task] || ""}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) =>
            handleDescriptionChange(task.id_task, e.target.value)
          }
        />
        <DefaultBtn
          variant={"blueSectionBtn"}
          onClick={() => handleSaveDescription(task.id_task)}
        >
          Добавить описание
        </DefaultBtn>
      </div>

      <div className={task_styles.descriptionBlock}>
        <div className={task_styles.deadlineBlock}>
          <label>
            <div>
              <span>Изменить дату выполнения:</span>
            </div>
            <DeadlineDateTimePicker
              value={task.due_date ? new Date(task.due_date) : null}
              onChange={(newDate) =>
                handleDeadlineChange(task.id_task, newDate)
              }
              mode={"change"}
            />
          </label>
        </div>
        <DefaultBtn
          variant={"exitDeleteBtn"}
          onClick={() => onDeleteTask(task.id_task)}
        >
          Удалить заметку
        </DefaultBtn>
      </div>
    </motion.li>
  );
};

export default InProgressDailyTask;
