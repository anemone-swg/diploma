import React, { useState } from "react";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Draggable } from "react-beautiful-dnd";
import task_styles from "./KanbanTask.module.css";
import EditableTitle from "../../../components/ui/EditableTitle.jsx";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { createTheme, ThemeProvider } from "@mui/material";

const KanbanTask = ({
  task,
  index,
  newTaskContent,
  setNewTaskContent,
  setBoards,
}) => {
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date(task.deadline));

  const theme = createTheme({
    palette: {
      mode: "light", // или 'dark', в зависимости от того, хотите ли вы светлую или темную тему
      primary: {
        main: "#303030", // Ваш основной цвет (например, синий)
        contrastText: "#3c3c3c", // Цвет текста для элементов на фоне primary
      },
      secondary: {
        main: "#f50057", // Вторичный цвет
        contrastText: "#fff", // Цвет текста для элементов на фоне secondary
      },
      background: {
        default: "#fafafa", // Фоновый цвет
        paper: "#fff", // Цвет для фона карточек и элементов
      },
      text: {
        primary: "#b3b3b3", // Основной цвет текста
        secondary: "#757575", // Цвет текста для вторичных элементов
      },
      // Добавьте другие цвета, которые вам нужны
    },
    typography: {
      fontFamily: "'Roboto', sans-serif", // Шрифт
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
              <div className={task_styles.taskUser}>{task.user}</div>

              {/* Календарь с использованием Material UI DatePicker */}
              <div className={task_styles.taskDeadline}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DesktopDatePicker
                    value={selectedDate}
                    onChange={(date) => {
                      setSelectedDate(date);
                      handleDeadlineChange(task.id, date.toISOString());
                    }}
                    slotProps={{
                      textField: {
                        sx: {
                          backgroundColor: theme.palette.primary.main, // Устанавливаем фон для поля ввода
                          color: theme.palette.text.primary, // Цвет текста в поле ввода
                          border: "none",
                          "&:hover": {
                            border: "none", // Цвет рамки при наведении
                            backgroundColor: theme.palette.primary.contrastText, // Фон при наведении
                          },
                          "&.Mui-focused": {
                            border: "none", // Цвет рамки при фокусе
                            backgroundColor: theme.palette.primary.contrastText, // Фон при фокусе
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
              </div>
            </div>
          </div>
        )}
      </Draggable>
    </ThemeProvider>
  );
};

export default KanbanTask;
