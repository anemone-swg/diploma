import React, { useState } from "react";
import boards_container from "./BoardContainer.module.css";
import kanban_styles from "../styles/Kanban.module.css";
import KanbanColumn from "./KanbanColumn.jsx";
import EditableTitle from "../../../components/ui/EditableTitle.jsx";
import DropdownMenu from "./DropdownMenu.jsx";
import InputWithActions from "../../../components/ui/InputWithActions.jsx";
import { DragDropContext } from "react-beautiful-dnd";

const BoardContainer = ({
  team,
  setDeletingTeam,
  setShowDeleteTeamModal,
  setBoards,
  boards,
  board,
  setDeletingColumn,
  setShowDeleteColumnModal,
}) => {
  const [editingTeamId, setEditingTeamId] = useState(null);
  const [teamTitle, setTeamTitle] = useState("");
  const [showColumnInput, setShowColumnInput] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");

  // Редактирование названия команды
  const handleTeamTitleChange = (boardId, teamId, newTitle) => {
    if (newTitle.trim()) {
      setBoards(
        boards.map((board) => {
          if (board.id === boardId) {
            return {
              ...board,
              teams: board.teams.map((team) => {
                if (team.id === teamId) {
                  return {
                    ...team,
                    title: newTitle,
                  };
                }
                return team;
              }),
            };
          }
          return board;
        }),
      );
    }
  };

  // Создание колонки для конкретной команды
  const handleCreateColumn = (boardId, teamId) => {
    if (newColumnTitle.trim()) {
      setBoards(
        boards.map((board) => {
          if (board.id === boardId) {
            return {
              ...board,
              teams: board.teams.map((team) => {
                if (team.id === teamId) {
                  return {
                    ...team,
                    columns: [
                      ...team.columns,
                      {
                        id: crypto.randomUUID(),
                        title: newColumnTitle,
                        tasks: [],
                      },
                    ],
                  };
                }
                return team;
              }),
            };
          }
          return board;
        }),
      );
      setNewColumnTitle("");
      setShowColumnInput(false);
    }
  };

  /*useEffect(() => {
      console.log("Обновленные boards:", boards);
    }, [boards]);*/ // Срабатывает при каждом изменении boards

  const handleDragEnd = (result) => {
    const { destination, source } = result;

    // Если нет цели или перемещение в то же место
    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    ) {
      return;
    }

    setBoards((prevBoards) => {
      return prevBoards.map((board) => ({
        ...board,
        teams: board.teams.map((team) => {
          // Для случая перемещения внутри одной колонки
          if (source.droppableId === destination.droppableId) {
            const column = team.columns.find(
              (col) => String(col.id) === source.droppableId,
            );
            if (!column) return team;

            const newTasks = [...column.tasks];
            const [removed] = newTasks.splice(source.index, 1);
            newTasks.splice(destination.index, 0, removed);

            return {
              ...team,
              columns: team.columns.map((col) =>
                String(col.id) === source.droppableId
                  ? { ...col, tasks: newTasks }
                  : col,
              ),
            };
          }

          // Для перемещения между разными колонками
          const sourceColumn = team.columns.find(
            (col) => String(col.id) === source.droppableId,
          );
          const destColumn = team.columns.find(
            (col) => String(col.id) === destination.droppableId,
          );

          if (!sourceColumn || !destColumn) return team;

          const newSourceTasks = [...sourceColumn.tasks];
          const newDestTasks = [...destColumn.tasks];
          const [movedTask] = newSourceTasks.splice(source.index, 1);
          newDestTasks.splice(destination.index, 0, movedTask);

          return {
            ...team,
            columns: team.columns.map((col) => {
              if (String(col.id) === source.droppableId) {
                return { ...col, tasks: newSourceTasks };
              }
              if (String(col.id) === destination.droppableId) {
                return { ...col, tasks: newDestTasks };
              }
              return col;
            }),
          };
        }),
      }));
    });
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd} key={board.id}>
      <div className={boards_container.board}>
        <div className={kanban_styles.elementHeader}>
          <EditableTitle
            item={team}
            isEditing={editingTeamId === team.id}
            title={teamTitle}
            placeholder="Название команды..."
            onEditStart={(id) => setEditingTeamId(id)}
            onEditEnd={() => setEditingTeamId(null)}
            onTitleChange={setTeamTitle}
            onChange={(id, newTitle) =>
              handleTeamTitleChange(board.id, id, newTitle)
            }
            level={3}
          />
          <DropdownMenu
            type="team"
            onAdd={() => setShowColumnInput(team.id)}
            onDelete={setShowDeleteTeamModal}
            onPrepareDelete={() =>
              setDeletingTeam({
                boardId: board.id,
                teamId: team.id,
              })
            }
          />
        </div>

        <hr />

        {showColumnInput === team.id && (
          <InputWithActions
            type="column"
            value={newColumnTitle}
            onChange={(e) => setNewColumnTitle(e.target.value)}
            onSubmit={() => handleCreateColumn(board.id, team.id)}
            onCancel={() => {
              setShowColumnInput(false);
              setNewColumnTitle("");
            }}
            placeholder="Название столбца..."
          />
        )}

        <div className={boards_container.columnsContainer}>
          {team.columns.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              newColumnTitle={newColumnTitle}
              setNewColumnTitle={setNewColumnTitle}
              setBoards={setBoards}
              boards={boards}
              setDeletingColumn={setDeletingColumn}
              setShowDeleteColumnModal={setShowDeleteColumnModal}
              team={team}
            />
          ))}
        </div>
      </div>
    </DragDropContext>
  );
};

export default BoardContainer;
