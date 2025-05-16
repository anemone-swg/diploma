import React, { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import task_styles from "./KanbanTask.module.css";
import btn_styles from "../../../../components/ui/DefaultBtn.module.css";
import EditableTitle from "../../../../components/ui/EditableTitle.jsx";
import DefaultBtn from "../../../../components/ui/DefaultBtn.jsx";
import { FaTrash } from "react-icons/fa";
import DeadlineDatePicker from "../../../../components/ui/DeadlineDatePicker.jsx";
import {
  deleteTask,
  taskContentChange,
  taskDeadlineChange,
  taskStatusChange,
} from "@/services/ProjectPlannerService.js";
import SelectedUser from "@/features/ProjectPlanner/kanban/components/SelectedUser.jsx";
import { RiProgress3Line } from "react-icons/ri";

const KanbanTask = ({
  task,
  index,
  newTaskContent,
  setNewTaskContent,
  setBoards,
  projectId,
}) => {
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(
    task.deadline ? new Date(task.deadline) : null,
  );

  const handleTaskContentChange = async (taskId, newContent) => {
    if (!newContent.trim()) return;
    try {
      await taskContentChange(taskId, newContent);

      setBoards((prevBoards) =>
        prevBoards.map((board) => ({
          ...board,
          teams: board.teams.map((team) => ({
            ...team,
            columns: team.columns.map((column) => ({
              ...column,
              tasks: column.tasks.map((t) =>
                t.id === taskId ? { ...t, content: newContent } : t,
              ),
            })),
          })),
        })),
      );
      setNewTaskContent(""); // Очистка поля ввода
    } catch (error) {
      console.error(error);
      alert("Ошибка при обновлении контента задачи");
    }
  };

  const handleDeadlineChange = async (taskId, newDeadline) => {
    try {
      await taskDeadlineChange(taskId, newDeadline);

      setBoards((prevBoards) =>
        prevBoards.map((board) => ({
          ...board,
          teams: board.teams.map((team) => ({
            ...team,
            columns: team.columns.map((column) => ({
              ...column,
              tasks: column.tasks.map((task) =>
                task.id === taskId ? { ...task, deadline: newDeadline } : task,
              ),
            })),
          })),
        })),
      );
    } catch (error) {
      console.error(error);
      alert("Ошибка при обновлении дэдлайна задачи");
    }
  };

  const handleDatePickerChange = (date) => {
    if (date) {
      setSelectedDate(date);
      handleDeadlineChange(task.id, date.toISOString());
    } else {
      // Если дата пуста, установим null
      setSelectedDate(null);
      handleDeadlineChange(task.id, null);
    }
  };

  const handleDeleteTaskBoard = async (taskId) => {
    try {
      await deleteTask(taskId);

      setBoards((prevBoards) =>
        prevBoards.map((board) => ({
          ...board,
          teams: board.teams.map((team) => ({
            ...team,
            columns: team.columns.map((column) => ({
              ...column,
              tasks: column.tasks.filter((task) => task.id !== taskId),
            })),
          })),
        })),
      );
    } catch (error) {
      console.error(error);
      alert("Ошибка при удалении задачи");
    }
  };

  const handleTaskStatusChange = async (taskId) => {
    try {
      await taskStatusChange(taskId);
    } catch (error) {
      console.error(error);
      alert("Ошибка при изменении статуса задачи");
    }
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`${task_styles.task} ${
            snapshot.isDragging ? task_styles.dragging : ""
          }`}
          style={{
            ...provided.draggableProps.style,
            top: "0 !important",
            left: "0 !important",
          }}
        >
          <div className={task_styles.taskBody}>
            <div className={task_styles.taskHeader}>
              <EditableTitle
                maxLength={500}
                item={task}
                isEditing={editingTaskId === task.id}
                title={newTaskContent}
                placeholder="Тест задачи..."
                onEditStart={(id) => setEditingTaskId(id)}
                onEditEnd={() => {
                  setEditingTaskId(null);
                }}
                onTitleChange={setNewTaskContent}
                onChange={(id, newContent) => {
                  handleTaskContentChange(id, newContent);
                }}
                level={3}
              />
              <DefaultBtn
                className={btn_styles.roundCornersBtn}
                icon={FaTrash}
                onClick={() => handleDeleteTaskBoard(task.id)}
              ></DefaultBtn>
            </div>

            <SelectedUser
              task={task}
              projectId={projectId}
              setBoards={setBoards}
            />

            {/* Календарь с использованием Material UI DatePicker */}
            <div className={task_styles.taskDeadlineAndCompletedStatus}>
              <div className={task_styles.deadlinePicker}>
                {!selectedDate && (
                  <span className={task_styles.noTimeMessage}>
                    Задача без срока
                  </span>
                )}
                <DeadlineDatePicker
                  value={selectedDate}
                  onChange={handleDatePickerChange}
                />
              </div>
              <DefaultBtn
                icon={task.completed === "awaiting_approval" && RiProgress3Line}
                className={`${btn_styles.roundCornersBtn} ${btn_styles.noSvgMargin}`}
                onClick={() => handleTaskStatusChange(task.id)}
              >
                {task.completed === "done"
                  ? "Выполнено"
                  : task.completed === "awaiting_approval"
                    ? ""
                    : "Выполнить"}
              </DefaultBtn>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default KanbanTask;
