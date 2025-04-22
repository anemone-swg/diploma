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
  const isPastelColor =
    column.color && column.color !== "var(--background-color)";

  /*useEffect(() => {
    console.log(boards);
  }, [boards]);*/

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
    setNewColumnTitle("");
  };

  const handleCreateTask = (teamId, columnId) => {
    if (newTaskContent.trim()) {
      const now = new Date();
      const defaultDeadline = new Date();
      defaultDeadline.setDate(now.getDate() + 7); // Дефолтный срок - через неделю
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
                          user: "Исполнитель не назначен",
                          deadline: defaultDeadline.toISOString(), // Дефолтный срок
                          createdAt: now.toISOString(), // Дата создания
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
      style={{ backgroundColor: column.color }}
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
                boards={boards}
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
