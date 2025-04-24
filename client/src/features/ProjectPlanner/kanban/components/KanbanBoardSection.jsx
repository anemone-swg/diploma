import React from "react";
import { FaPlus } from "react-icons/fa";
import kanban_board_section_styles from "./KanbanBoardSection.module.css";
import btn_styles from "../../../../components/ui/DefaultBtn.module.css";
import DefaultBtn from "../../../../components/ui/DefaultBtn.jsx";
import TitleProject from "./TitleProject.jsx";
import BoardContainer from "./BoardContainer.jsx";

const KanbanBoardSection = ({
  boards,
  setBoards,
  newBoardTitle,
  setNewBoardTitle,
  setShowDeleteTeamModal,
  setDeletingTeam,
  setDeletingColumn,
  setShowDeleteColumnModal,
}) => {
  // Добавление новой команды
  const handleAddTeam = (boardId) => {
    setBoards(
      boards.map((board) => {
        if (board.id === boardId) {
          return {
            ...board,
            teams: [
              ...board.teams,
              {
                id: crypto.randomUUID(),
                title: "Новая команда",
                columns: [],
              },
            ],
          };
        }
        return board;
      }),
    );
  };

  return (
    <div>
      {boards.map((board) => (
        <div key={board.id}>
          <TitleProject
            board={board}
            newBoardTitle={newBoardTitle}
            setNewBoardTitle={setNewBoardTitle}
            setBoards={setBoards}
            boards={boards}
          />

          {board.teams.map((team) => (
            <div
              key={team.id}
              className={kanban_board_section_styles.boardContainer}
            >
              <BoardContainer
                team={team}
                setDeletingTeam={setDeletingTeam}
                setShowDeleteTeamModal={setShowDeleteTeamModal}
                setBoards={setBoards}
                boards={boards}
                board={board}
                setDeletingColumn={setDeletingColumn}
                setShowDeleteColumnModal={setShowDeleteColumnModal}
              />
            </div>
          ))}

          <div>
            <DefaultBtn
              onClick={() => handleAddTeam(board.id)}
              className={btn_styles.roundCornersBtn}
              icon={FaPlus}
            >
              Добавить команду
            </DefaultBtn>
          </div>
        </div>
      ))}
    </div>
  );
};

export default KanbanBoardSection;
