import React, { useState } from "react";
import boards_container from "./BoardContainer.module.css";
import kanban_styles from "../styles/Kanban.module.css";
import DefaultInput from "../../../components/ui/DefaultInput.jsx";
import DefaultBtn from "../../../components/ui/DefaultBtn.jsx";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { RxCross1 } from "react-icons/rx";
import KanbanColumn from "./KanbanColumn.jsx";
import EditableTitle from "../../../components/ui/EditableTitle.jsx";
import DropdownMenu from "./DropdownMenu.jsx";

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
        <div className={kanban_styles.inputContainer}>
          <DefaultInput
            value={newColumnTitle}
            onChange={(e) => setNewColumnTitle(e.target.value)}
            onKeyPress={(e) =>
              e.key === "Enter" && handleCreateColumn(board.id, team.id)
            }
            placeholder="Название столбца..."
            autoFocus
          />
          <div className={kanban_styles.inputActions}>
            <DefaultBtn
              variant="createConfirmBtn"
              icon={IoCheckmarkDoneOutline}
              onClick={() => handleCreateColumn(board.id, team.id)}
            >
              Добавить
            </DefaultBtn>
            <DefaultBtn
              variant="cancelBtn"
              icon={RxCross1}
              onClick={() => {
                setShowColumnInput(false);
                setNewColumnTitle("");
              }}
            >
              Отмена
            </DefaultBtn>
          </div>
        </div>
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
