import React, { useState } from "react";
import kanban_styles from "../styles/Kanban.module.css";
import column_styles from "./KanbanColumn.module.css";
import EditableTitle from "../../../../components/ui/EditableTitle.jsx";
import DropdownMenu from "./DropdownMenu.jsx";
import InputWithActions from "../../../../components/ui/InputWithActions.jsx";
import KanbanTask from "./KanbanTask.jsx";
import { StrictModeDroppable } from "./StrictModeDroppable.jsx";
import ColorPicker from "./ColorPicker.jsx";
import { createTask, renameColumn } from "@/services/ProjectPlannerService.js";
import { useTheme } from "@/context/ThemeContext.jsx";
import { columnColors } from "@/constants/columnColors.js";

const KanbanColumn = ({
  column,
  newColumnTitle,
  setNewColumnTitle,
  setBoards,
  setDeletingColumn,
  setShowDeleteColumnModal,
  team,
  projectId,
}) => {
  const [editingColumnId, setEditingColumnId] = useState(null);
  const [showTaskInput, setShowTaskInput] = useState(null);
  const [newTaskContent, setNewTaskContent] = useState("");
  const { theme } = useTheme();
  const columnColor =
    columnColors[theme][column.color] || columnColors[theme].default;
  const isPastelColor = column.color && column.color !== "default";

  const handleColumnTitleChange = (columnId, newTitle) => {
    if (newColumnTitle.trim()) {
      renameColumn(columnId, newTitle).then(() => {
        setBoards((prevBoards) =>
          prevBoards.map((board) => ({
            ...board,
            teams: board.teams.map((team) => ({
              ...team,
              columns: team.columns.map((col) =>
                col.id === columnId ? { ...col, title: newTitle } : col,
              ),
            })),
          })),
        );
        setNewColumnTitle("");
      });
    }
  };

  const handleCreateTask = async (teamId, columnId) => {
    if (newTaskContent.trim()) {
      try {
        const createdTask = await createTask(newTaskContent, columnId);

        setBoards((prevBoards) =>
          prevBoards.map((board) => ({
            ...board,
            teams: board.teams.map((team) => {
              if (team.id === teamId) {
                return {
                  ...team,
                  columns: team.columns.map((column) => {
                    if (column.id === columnId) {
                      return {
                        ...column,
                        tasks: [
                          ...column.tasks,
                          {
                            id: createdTask.id_task,
                            id_task: createdTask.id_task,
                            content: createdTask.content,
                            completed: createdTask.completed,
                            deadline: createdTask.deadline,
                            createdAt: createdTask.createdAt,
                          },
                        ],
                      };
                    }
                    return column;
                  }),
                };
              }
              return team;
            }),
          })),
        );

        setNewTaskContent("");
        setShowTaskInput(false);
      } catch (_) {
        /* empty */
      }
    }
  };

  return (
    <div
      className={column_styles.column}
      style={{ backgroundColor: columnColor }}
    >
      <div className={kanban_styles.elementHeader}>
        <EditableTitle
          item={column}
          isEditing={editingColumnId === column.id}
          title={newColumnTitle}
          placeholder="Название столбца..."
          onEditStart={(id) => setEditingColumnId(id)}
          onEditEnd={() => {
            setEditingColumnId(null);
          }}
          onTitleChange={setNewColumnTitle}
          onChange={(id, newTitle) => {
            handleColumnTitleChange(id, newTitle);
          }}
          level={3}
          isPastelColor={isPastelColor}
        />
        <div className={column_styles.columnBtns}>
          <DropdownMenu
            type="column"
            onAdd={() => setShowTaskInput(column.id)}
            onDelete={setShowDeleteColumnModal}
            onPrepareDelete={() =>
              setDeletingColumn({
                teamId: team.id,
                columnId: column.id,
              })
            }
            isPastelColor={isPastelColor}
          />
          <ColorPicker
            setBoards={setBoards}
            column={column}
            isPastelColor={isPastelColor}
          />
        </div>
      </div>

      <hr
        style={{
          borderTop: isPastelColor
            ? "2px solid var(--text-color-dark)"
            : "2px solid var(--text-color)",
        }}
      />

      {showTaskInput === column.id && (
        <InputWithActions
          type="task"
          value={newTaskContent}
          onChange={(e) => setNewTaskContent(e.target.value)}
          onSubmit={() => handleCreateTask(team.id, column.id)}
          onCancel={() => {
            setShowTaskInput(false);
            setNewTaskContent("");
          }}
          placeholder="Ваша задача..."
          maxLength={500}
        />
      )}
      <StrictModeDroppable
        droppableId={String(column.id)}
        type="TASK"
        isDropDisabled={false}
        isCombineEnabled={false}
        ignoreContainerClipping={true}
      >
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`${column_styles.taskContainer} ${
              snapshot.isDraggingOver ? column_styles.draggingOver : ""
            }`}
          >
            {column.tasks.map((task, taskIndex) => (
              <KanbanTask
                key={task.id}
                task={task}
                index={taskIndex}
                newTaskContent={newTaskContent}
                setNewTaskContent={setNewTaskContent}
                setBoards={setBoards}
                projectId={projectId}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </StrictModeDroppable>
    </div>
  );
};

export default KanbanColumn;
