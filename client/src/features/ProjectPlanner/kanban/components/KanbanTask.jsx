import React, { useState } from "react";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Draggable } from "react-beautiful-dnd";
import task_styles from "./KanbanTask.module.css";
import btn_styles from "../../../../components/ui/DefaultBtn.module.css";
import EditableTitle from "../../../../components/ui/EditableTitle.jsx";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { createTheme, ThemeProvider } from "@mui/material";
import DefaultBtn from "../../../../components/ui/DefaultBtn.jsx";
import { FaTrash } from "react-icons/fa";

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
                {!selectedDate && (
                  <span className={task_styles.noTimeMessage}>
                    Задача без срока
                  </span>
                )}
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DesktopDatePicker
                    value={selectedDate}
                    onChange={handleDatePickerChange} // Обновляем значение с учётом пустого значения
                    slotProps={{
                      textField: {
                        sx: {
                          backgroundColor: theme.palette.primary.main, // Устанавливаем фон для поля ввода
                          color: theme.palette.text.primary, // Цвет текста в поле ввода
                          transition: "0.4s background-color ease",
                          "&:hover": {
                            backgroundColor: theme.palette.primary.contrastText, // Фон при наведении
                          },
                          "&.Mui-focused": {
                            backgroundColor: theme.palette.primary.contrastText, // Фон при фокусе
                          },
                          // Стили для иконки календаря
                          "& .MuiSvgIcon-root": {
                            color: theme.palette.text.primary, // Цвет иконки календаря
                          },
                        },
                      },
                      day: {
                        sx: {
                          color: "var(--text-color)",
                          "&.MuiPickersDay-today": {
                            border: "1px solid var(--text-color)",
                          },
                          "&.Mui-selected": {
                            backgroundColor:
                              "var(--background-color) !important",
                            color: "var(--text-color) !important",
                            border: "1px solid black",
                          },
                          "&.Mui-selected:hover": {
                            backgroundColor:
                              "var(--background-color) !important",
                          },
                          "&:hover": {
                            backgroundColor: "var(--background-color)",
                          },
                        },
                      },
                      layout: {
                        sx: {
                          borderRadius: "4px",
                          backgroundColor: "var(--light-background-color)",
                          color: "var(--text-color)",
                          "& .MuiTypography-root": {
                            color: "var(--text-color)",
                          },
                          "& .MuiIconButton-root": {
                            color: "var(--text-color)",
                          },
                          border: "1px solid var(--text-color)",
                        },
                      },
                    }}
                  />
                </LocalizationProvider>
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
