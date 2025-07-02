import React, { useState } from "react";
import styles from "@/features/TaskInput/ui/TaskInput.module.css";
import additional_styles from "@/shared/lib/classNames/Additional.module.css";
import DefaultInput from "@/shared/ui/DefaultInput.jsx";
import DeadlineDateTimePicker from "@/shared/ui/DeadlineDateTimePicker.jsx";
import DefaultBtn from "@/shared/ui/DefaultBtn.jsx";
import { addTask } from "@/features/TaskInput/modal/api/addTask.js";

const TaskInput = ({ setTasks, setTaskDescriptionMap }) => {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      addTask(newTaskTitle, dueDate).then((newTask) => {
        if (newTask) {
          setTasks((prev) => [
            ...prev,
            {
              ...newTask,
              description: "",
              completed: false,
              title: newTaskTitle,
            },
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

  return (
    <div className={`${styles.taskInput} ${additional_styles.moduleSection}`}>
      <label className={styles.taskLabel}>
        Название задачи:
        <DefaultInput
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

      <DefaultBtn variant={"blueSectionBtn"} onClick={handleAddTask}>
        Добавить
      </DefaultBtn>
    </div>
  );
};

export default TaskInput;
