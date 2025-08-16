import React, { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import task_styles from "@/widgets/KanbanBoardSection/ui/ui/KanbanTask.module.css";
import DefaultBtn from "@/shared/ui/DefaultBtn.jsx";
import { FaTrash } from "react-icons/fa";
import DeadlineDatePicker from "@/shared/ui/DeadlineDatePicker.jsx";
import SelectedUser from "@/features/SelectedUser/ui/SelectedUser.jsx";
import { RiProgress3Line } from "react-icons/ri";
import EditableTitle from "@/shared/ui/EditableTitle.jsx";
import { deleteTask } from "../../api/deleteTask.js";
import { taskStatusChange } from "@/entities/Task/api/taskStatusChange.js";
import { taskContentChange } from "@/entities/Task/api/taskContentChange.js";
import { taskDeadlineChange } from "@/entities/Task/api/taskDeadlineChange.js";

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

  const handleTaskContentChange = (taskId, newContent) => {
    if (!newContent.trim()) return;

    taskContentChange(taskId, newContent).then(() => {
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
      setNewTaskContent("");
    });
  };

  const handleDeadlineChange = (taskId, newDeadline) => {
    taskDeadlineChange(taskId, newDeadline).then(() => {
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
    });
  };

  const handleDatePickerChange = (date) => {
    if (date) {
      setSelectedDate(date);
      handleDeadlineChange(task.id, date.toISOString());
    } else {
      setSelectedDate(null);
      handleDeadlineChange(task.id, null);
    }
  };

  const handleDeleteTaskBoard = (taskId) => {
    deleteTask(taskId).then(() => {
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
    });
  };

  const handleTaskStatusChange = (taskId) => {
    taskStatusChange(taskId).then(() => {});
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
