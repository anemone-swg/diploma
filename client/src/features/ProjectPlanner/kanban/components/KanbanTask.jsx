import React, { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import task_styles from "./KanbanTask.module.css";
import btn_styles from "../../../../components/ui/DefaultBtn.module.css";
import EditableTitle from "../../../../components/ui/EditableTitle.jsx";
import { createTheme, ThemeProvider } from "@mui/material";
import DefaultBtn from "../../../../components/ui/DefaultBtn.jsx";
import { FaTrash } from "react-icons/fa";
import DeadlineDatePicker from "../../../../components/ui/DeadlineDatePicker.jsx";

const KanbanTask = ({
  task,
  index,
  newTaskContent,
  setNewTaskContent,
  setBoards,
}) => {
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(
    task.deadline ? new Date(task.deadline) : null,
  );

  const theme = createTheme({
    palette: {
      primary: {
        main: "#303030",
        contrastText: "#3c3c3c",
      },
      text: {
        primary: "#b3b3b3",
      },
    },
  });

  const handleTaskContentChange = (taskId, newContent) => {
    if (!newContent.trim()) return;
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
  };

  const handleDeadlineChange = (taskId, newDeadline) => {
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

  const handleDeleteTaskBoard = (taskId) => {
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
  };

  const handleTaskStatusChange = (taskId) => {
    setBoards((prevBoards) =>
      prevBoards.map((board) => ({
        ...board,
        teams: board.teams.map((team) => ({
          ...team,
          columns: team.columns.map((column) => ({
            ...column,
            tasks: column.tasks.map((t) =>
              t.id === taskId ? { ...t, completed: !t.completed } : t,
            ),
          })),
        })),
      })),
    );
  };

  return (
    <ThemeProvider theme={theme}>
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
              <div className={task_styles.taskUser}>{task.user}</div>

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
                  className={btn_styles.roundCornersBtn}
                  onClick={() => handleTaskStatusChange(task.id)}
                >
                  {task.completed ? "Выполнено" : "Выполнить"}
                </DefaultBtn>
              </div>
            </div>
          </div>
        )}
      </Draggable>
    </ThemeProvider>
  );
};

export default KanbanTask;
