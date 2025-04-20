import React, { useState } from "react";
import boards_container from "./BoardContainer.module.css";
import kanban_styles from "../styles/Kanban.module.css";
import KanbanColumn from "./KanbanColumn.jsx";
import EditableTitle from "../../../components/ui/EditableTitle.jsx";
import DropdownMenu from "./DropdownMenu.jsx";
import InputWithActions from "../../../components/ui/InputWithActions.jsx";

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
                        id: Date.now(),
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

  return (
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
  );
};

export default BoardContainer;
