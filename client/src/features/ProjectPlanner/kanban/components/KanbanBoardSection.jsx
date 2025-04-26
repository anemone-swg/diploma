import React, { memo, useCallback } from "react";
import { FaPlus } from "react-icons/fa";
import kanban_board_section_styles from "./KanbanBoardSection.module.css";
import btn_styles from "../../../../components/ui/DefaultBtn.module.css";
import DefaultBtn from "../../../../components/ui/DefaultBtn.jsx";
import TitleProject from "./TitleProject.jsx";
import BoardContainer from "./BoardContainer.jsx";

const KanbanBoardSection = memo(
  ({
    boards,
    setBoards,
    newBoardTitle,
    setNewBoardTitle,
    setShowDeleteTeamModal,
    setDeletingTeam,
    setDeletingColumn,
    setShowDeleteColumnModal,
    sidebarWidth,
  }) => {
    const handleAddTeam = useCallback(
      (boardId) => {
        setBoards((prevBoards) =>
          prevBoards.map((board) => {
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
      },
      [setBoards],
    );

    return (
      <div>
        {boards.map((board) => (
          <div key={board.id}>
            <TitleProject
              board={board}
              newBoardTitle={newBoardTitle}
              setNewBoardTitle={setNewBoardTitle}
              setBoards={setBoards}
            />

            {board.teams.map((team) => (
              <div
                key={team.id}
                className={kanban_board_section_styles.boardContainer}
                style={{
                  maxWidth: `calc(95vw - ${sidebarWidth}px)`,
                }}
              >
                <BoardContainer
                  team={team}
                  setDeletingTeam={setDeletingTeam}
                  setShowDeleteTeamModal={setShowDeleteTeamModal}
                  setBoards={setBoards}
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
  },
);

export default KanbanBoardSection;
