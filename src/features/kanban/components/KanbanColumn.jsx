import React, { useState } from "react";
import kanban_styles from "../styles/Kanban.module.css";
import column_styles from "./KanbanColumn.module.css";
import EditableTitle from "../../../components/ui/EditableTitle.jsx";
import DropdownMenu from "./DropdownMenu.jsx";
import InputWithActions from "../../../components/ui/InputWithActions.jsx";
import KanbanTask from "./KanbanTask.jsx";
import { StrictModeDroppable } from "./StrictModeDroppable.jsx";
import ColorPicker from "./ColorPicker.jsx";

const KanbanColumn = ({
  column,
  newColumnTitle,
  setNewColumnTitle,
  setBoards,
  boards,
  setDeletingColumn,
  setShowDeleteColumnModal,
  team,
}) => {
  const [editingColumnId, setEditingColumnId] = useState(null);
  const [showTaskInput, setShowTaskInput] = useState(null);
  const [newTaskContent, setNewTaskContent] = useState("");
  const [selectedColor, setSelectedColor] = useState(""); // Состояние для выбранного цвета
  const isPastelColor = selectedColor && selectedColor !== "#232323";

  const handleColumnTitleChange = (columnId, newTitle) => {
    if (newColumnTitle.trim()) {
      setBoards(
        boards.map((board) => ({
          ...board,
          teams: board.teams.map((team) => ({
            ...team,
            columns: team.columns.map((col) =>
              col.id === columnId ? { ...col, title: newTitle } : col,
            ),
          })),
        })),
      );
    }
  };

  const handleCreateTask = (teamId, columnId, newTaskContent) => {
    if (newTaskContent.trim()) {
      setBoards(
        boards.map((board) => ({
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
                          id: crypto.randomUUID(),
                          content: newTaskContent,
                          completed: false,
                          // Другие свойства задачи
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

      // Очищаем поле ввода после создания
      setNewTaskContent("");
      setShowTaskInput(false);
    }
  };

  return (
    <div
      className={column_styles.column}
      style={{ backgroundColor: selectedColor }}
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
            setSelectedColor={setSelectedColor}
            setBoards={setBoards}
            boards={boards}
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
          onSubmit={() => handleCreateTask(team.id, column.id, newTaskContent)}
          onCancel={() => {
            setShowTaskInput(false);
            setNewTaskContent("");
          }}
          placeholder="Ваша задача..."
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
              <KanbanTask key={task.id} task={task} index={taskIndex} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </StrictModeDroppable>
    </div>
  );
};

export default KanbanColumn;
