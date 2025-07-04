import React, { useEffect } from "react";
import styles from "@/shared/lib/classNames/Additional.module.css";
import modal_styles from "@/shared/lib/classNames/ModalWindow.module.css";
import DefaultBtn from "@/shared/ui/DefaultBtn.jsx";
import DefaultInput from "@/shared/ui/DefaultInput.jsx";
import { PiKanban } from "react-icons/pi";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { RxCross1 } from "react-icons/rx";
import { FaTrash } from "react-icons/fa";
import {
  createProject,
  deleteColumn,
  deleteProject,
  deleteTeam,
} from "@/services/ProjectPlannerService.js";
import { ModalTypes } from "@/shared/constants/modalTypes.js";

const ModalWindow = ({
  newBoardTitle,
  setNewBoardTitle,
  setShowModal,
  showModal,
  setBoards,
  setActiveSection,
  boards,
  modalType = ModalTypes.CREATE,
  setDeletingTeam,
  deletingTeam,
  setDeletingColumn,
  deletingColumn,
}) => {
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (e.target.classList.contains(modal_styles.modal)) {
        setShowModal(false);
        setNewBoardTitle("");
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [setNewBoardTitle, setShowModal, showModal]);

  const handleCreateBoard = async () => {
    if (newBoardTitle.trim() && boards.length === 0) {
      try {
        const createdProject = await createProject({
          title: newBoardTitle,
        });

        const newBoard = {
          id: createdProject.id_project,
          title: createdProject.title,
          teams: [],
          createdAt: createdProject.createdAt,
        };

        setBoards([newBoard]);
        setNewBoardTitle("");
        setShowModal(false);
        setActiveSection("kanban");
      } catch (_) {
        /* empty */
      }
    }
  };

  const handleDeleteBoard = () => {
    deleteProject().then(() => {
      setBoards([]);
      setActiveSection("main");
      setShowModal(false);
    });
  };

  const handleDeleteTeamBoard = ({ boardId, teamId }) => {
    deleteTeam(teamId).then(() => {
      setBoards(
        boards.map((board) => {
          if (board.id === boardId) {
            const updatedTeams = board.teams.filter(
              (team) => team.id !== teamId,
            );
            return {
              ...board,
              teams: updatedTeams,
            };
          }
          return board;
        }),
      );
      setShowModal(false);
    });
  };

  const handleDeleteColumnBoard = ({ teamId, columnId }) => {
    deleteColumn(columnId, teamId).then(() => {
      setBoards(
        boards.map((board) => ({
          ...board,
          teams: board.teams.map((team) => {
            if (team.id === teamId) {
              const updatedColumns = team.columns
                .filter((column) => column.id !== columnId)
                .map((column, index) => ({
                  ...column,
                  order: index + 1,
                }));

              return {
                ...team,
                columns: updatedColumns,
              };
            }
            return team;
          }),
        })),
      );
      setShowModal(false);
    });
  };

  return (
    <div
      className={`${modal_styles.modal} ${showModal ? modal_styles.activeModal : ""}`}
    >
      {showModal && (
        <div className={modal_styles.modalContent}>
          {(() => {
            switch (modalType) {
              case ModalTypes.CREATE:
                return (
                  <>
                    <h3>
                      <PiKanban className={styles.icon} />
                      Создание kanban-доски
                    </h3>
                    <DefaultInput
                      maxLength={100}
                      value={newBoardTitle}
                      onChange={(e) => setNewBoardTitle(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleCreateBoard()
                      }
                      placeholder="Название проекта..."
                      autoFocus
                    />
                    <div className={modal_styles.modalActions}>
                      <DefaultBtn
                        svgMargin
                        variant="confirmBtn"
                        icon={IoCheckmarkDoneOutline}
                        onClick={handleCreateBoard}
                      >
                        Создать
                      </DefaultBtn>
                      <DefaultBtn
                        svgMargin
                        variant="cancelBtn"
                        icon={RxCross1}
                        onClick={() => {
                          setShowModal(false);
                          setNewBoardTitle("");
                        }}
                      >
                        Отмена
                      </DefaultBtn>
                    </div>
                  </>
                );

              case ModalTypes.DELETE:
                return (
                  <>
                    <h3>
                      <FaTrash className={styles.icon} />
                      Удаление kanban-доски
                    </h3>
                    <p>
                      Вы уверены, что хотите полностью удалить доску? Все данные
                      будут потеряны.
                    </p>
                    <div className={modal_styles.modalActions}>
                      <DefaultBtn
                        svgMargin
                        variant="cancelBtn"
                        icon={FaTrash}
                        onClick={handleDeleteBoard}
                      >
                        Удалить
                      </DefaultBtn>
                      <DefaultBtn
                        svgMargin
                        icon={RxCross1}
                        onClick={() => setShowModal(false)}
                        variant="confirmBtn"
                      >
                        Отмена
                      </DefaultBtn>
                    </div>
                  </>
                );

              case ModalTypes.DELETE_TEAM:
                return (
                  <>
                    <h3>
                      <FaTrash className={styles.icon} />
                      Удаление команды kanban-доски
                    </h3>
                    <p>
                      Вы уверены, что хотите удалить команду? Все данные будут
                      потеряны.
                    </p>
                    <div className={modal_styles.modalActions}>
                      <DefaultBtn
                        svgMargin
                        variant="cancelBtn"
                        icon={FaTrash}
                        onClick={() => {
                          handleDeleteTeamBoard(deletingTeam);
                          setDeletingTeam(null);
                        }}
                      >
                        Удалить
                      </DefaultBtn>
                      <DefaultBtn
                        svgMargin
                        icon={RxCross1}
                        onClick={() => setShowModal(false)}
                        variant="confirmBtn"
                      >
                        Отмена
                      </DefaultBtn>
                    </div>
                  </>
                );

              case ModalTypes.DELETE_COLUMN:
                return (
                  <>
                    <h3>
                      <FaTrash className={styles.icon} />
                      Удаление столбца kanban-доски
                    </h3>
                    <p>
                      Вы уверены, что хотите удалить столбец? Все данные будут
                      потеряны.
                    </p>
                    <div className={modal_styles.modalActions}>
                      <DefaultBtn
                        svgMargin
                        variant="cancelBtn"
                        icon={FaTrash}
                        onClick={() => {
                          handleDeleteColumnBoard(deletingColumn);
                          setDeletingColumn(null);
                        }}
                      >
                        Удалить
                      </DefaultBtn>
                      <DefaultBtn
                        svgMargin
                        icon={RxCross1}
                        onClick={() => setShowModal(false)}
                        variant="confirmBtn"
                      >
                        Отмена
                      </DefaultBtn>
                    </div>
                  </>
                );

              default:
                return null;
            }
          })()}
        </div>
      )}
    </div>
  );
};

export default ModalWindow;
