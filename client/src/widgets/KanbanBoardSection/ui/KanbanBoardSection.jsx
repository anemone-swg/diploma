import React, { memo, useCallback, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import kanban_board_section_styles from "@/widgets/KanbanBoardSection/ui/KanbanBoardSection.module.css";
import btn_styles from "@/shared/ui/DefaultBtn.module.css";
import DefaultBtn from "@/shared/ui/DefaultBtn.jsx";
import TitleProject from "@/features/TitleProject/ui/TitleProject.jsx";
import BoardContainer from "@/widgets/KanbanBoardSection/ui/ui/BoardContainer.jsx";
import { createTeam } from "../api/createTeam.js";

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
    useEffect(() => {
      console.log(boards);
    }, [boards]);

    const handleAddTeam = useCallback(
      async (boardId) => {
        try {
          const createdTeam = await createTeam("Новая команда", boardId);

          setBoards((prevBoards) =>
            prevBoards.map((board) => {
              if (board.id === boardId) {
                return {
                  ...board,
                  teams: [
                    ...board.teams,
                    {
                      id: createdTeam.id_team,
                      title: createdTeam.title,
                      columns: [],
                    },
                  ],
                };
              }
              return board;
            }),
          );
        } catch (_) {
          /* empty */
        }
      },
      [setBoards],
    );

    return (
      <>
        {boards.map((board) => (
          <div key={board.id}>
            <TitleProject
              board={board}
              newBoardTitle={newBoardTitle}
              setNewBoardTitle={setNewBoardTitle}
              setBoards={setBoards}
            />
            {board.teams &&
              board.teams.map((team) => (
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

            <>
              <DefaultBtn
                onClick={() => handleAddTeam(board.id)}
                className={btn_styles.roundCornersBtn}
                icon={FaPlus}
              >
                Добавить команду
              </DefaultBtn>
            </>
          </div>
        ))}
      </>
    );
  },
);

export default KanbanBoardSection;
