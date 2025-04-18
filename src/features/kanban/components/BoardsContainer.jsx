import React, { useState } from "react";
import styles from "../../../styles/App.module.css";
import DefaultInput from "../../../components/ui/DefaultInput.jsx";
import TeamDropdownMenu from "./TeamDropdownMenu.jsx";
import DefaultBtn from "../../../components/ui/DefaultBtn.jsx";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { RxCross1 } from "react-icons/rx";
import KanbanColumn from "./KanbanColumn.jsx";
import EditableTitle from "../../../components/ui/EditableTitle.jsx";

const BoardsContainer = ({
  team,
  setDeletingTeam,
  setShowDeleteTeamModal,
  setBoards,
  boards,
  board,
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
    <div className={styles.board}>
      <div className={styles.boardHeader}>
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
        <TeamDropdownMenu
          setShowColumnInput={() => setShowColumnInput(team.id)}
          setShowDeleteTeamModal={setShowDeleteTeamModal}
          setDeletingTeam={() => {
            setDeletingTeam({ boardId: board.id, teamId: team.id });
          }}
        />
      </div>

      <hr />

      {showColumnInput === team.id && (
        <div className={styles.columnInputContainer}>
          <DefaultInput
            value={newColumnTitle}
            onChange={(e) => setNewColumnTitle(e.target.value)}
            onKeyPress={(e) =>
              e.key === "Enter" && handleCreateColumn(board.id, team.id)
            }
            placeholder="Название столбца..."
            autoFocus
          />
          <div className={styles.columnInputActions}>
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

      <div className={styles.columnsContainer}>
        {team.columns.map((column) => (
          <KanbanColumn key={column.id} column={column} />
        ))}
      </div>
    </div>
  );
};

export default BoardsContainer;
