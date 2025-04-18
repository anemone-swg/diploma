import React from "react";
import { FaPlus } from "react-icons/fa";
import styles from "../../../styles/App.module.css";
import DefaultBtn from "../../../components/ui/DefaultBtn.jsx";
import TitleProject from "./TitleProject.jsx";
import BoardsContainer from "./BoardsContainer.jsx";

const KanbanBoardSection = ({
  boards,
  setBoards,
  newBoardTitle,
  setNewBoardTitle,
  setShowDeleteTeamModal,
  setDeletingTeam,
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
                id: Date.now(),
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
            <div key={team.id} className={styles.boardContainer}>
              <BoardsContainer
                team={team}
                setDeletingTeam={setDeletingTeam}
                setShowDeleteTeamModal={setShowDeleteTeamModal}
                setBoards={setBoards}
                boards={boards}
                board={board}
              />
            </div>
          ))}

          <div>
            <DefaultBtn
              onClick={() => handleAddTeam(board.id)}
              className={styles.roundCornersBtn}
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
