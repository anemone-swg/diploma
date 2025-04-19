import React, { useState } from "react";
import kanban_styles from "../styles/Kanban.module.css";
import column_styles from "./KanbanColumn.module.css";
import EditableTitle from "../../../components/ui/EditableTitle.jsx";
import DefaultInput from "../../../components/ui/DefaultInput.jsx";
import DefaultBtn from "../../../components/ui/DefaultBtn.jsx";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { RxCross1 } from "react-icons/rx";
import KanbanTask from "./KanbanTask.jsx";
import DropdownMenu from "./DropdownMenu.jsx";

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
                          id: Date.now(),
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
    <div className={column_styles.column}>
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
        />
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
        />
      </div>

      <hr />

      {showTaskInput === column.id && (
        <div
          className={`${kanban_styles.inputContainer} ${kanban_styles.inputContainerLight}`}
        >
          <DefaultInput
            value={newTaskContent}
            onChange={(e) => setNewTaskContent(e.target.value)}
            onKeyPress={(e) =>
              e.key === "Enter" &&
              handleCreateTask(team.id, column.id, newTaskContent)
            }
            placeholder="Ваша задача..."
            autoFocus
          />
          <div className={kanban_styles.inputActions}>
            <DefaultBtn
              variant="createConfirmBtn"
              icon={IoCheckmarkDoneOutline}
              onClick={() =>
                handleCreateTask(team.id, column.id, newTaskContent)
              }
            >
              Добавить
            </DefaultBtn>
            <DefaultBtn
              variant="cancelBtn"
              icon={RxCross1}
              onClick={() => {
                setShowTaskInput(false);
                setNewTaskContent("");
              }}
            >
              Отмена
            </DefaultBtn>
          </div>
        </div>
      )}

      <div className={column_styles.taskContainer}>
        {column.tasks.map((task) => (
          <KanbanTask key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};

export default KanbanColumn;
