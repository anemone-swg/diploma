import React, { useEffect } from "react";
import main_styles from "../../styles/App.module.css";
import navbar_styles from "./ModalWindow.module.css";
import DefaultBtn from "../ui/DefaultBtn.jsx";
import DefaultInput from "../ui/DefaultInput.jsx";
import { PiKanban } from "react-icons/pi";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { RxCross1 } from "react-icons/rx";
import { FaTrash } from "react-icons/fa";

// Типы модальных окон
export const ModalTypes = {
  CREATE: "create",
  DELETE: "delete",
  DELETE_TEAM: "delete_team",
  DELETE_COLUMN: "delete_column",
};

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
  // Эффект для закрытия модалки
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (e.target.classList.contains(navbar_styles.modal)) {
        setShowModal(false);
        setNewBoardTitle("");
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showModal]);

  // Создание доски
  const handleCreateBoard = () => {
    if (newBoardTitle.trim() && boards.length === 0) {
      const newBoard = {
        id: Date.now(),
        title: newBoardTitle,
        teams: [
          // Теперь доска содержит массив команд
          {
            id: Date.now(),
            title: "Новая команда", // Изначальное название команды
            columns: [], // Колонки для этой команды
          },
        ],
      };
      setBoards([newBoard]);
      setNewBoardTitle("");
      setShowModal(false);
      setActiveSection("kanban");
    }
  };

  const handleDeleteBoard = () => {
    setBoards([]);
    setActiveSection("main");
    setShowModal(false);
  };

  const handleDeleteTeamBoard = ({ boardId, teamId }) => {
    setBoards(
      boards.map((board) => {
        if (board.id === boardId) {
          // Фильтруем массив команд, удаляя нужную команду
          const updatedTeams = board.teams.filter((team) => team.id !== teamId);

          // Возвращаем доску с обновленным списком команд (даже если он пустой)
          return {
            ...board,
            teams: updatedTeams,
          };
        }
        return board;
      }),
    );
    setShowModal(false);
  };

  const handleDeleteColumnBoard = ({ teamId, columnId }) => {
    setBoards(
      boards.map((board) => ({
        ...board,
        teams: board.teams.map((team) => {
          if (team.id === teamId) {
            // Фильтруем массив колонок, удаляя нужную колонку
            const updatedColumns = team.columns.filter(
              (column) => column.id !== columnId,
            );

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
  };

  return (
    <div
      className={`${navbar_styles.modal} ${showModal ? navbar_styles.activeModal : ""}`}
    >
      {showModal && (
        <div className={navbar_styles.modalContent}>
          {(() => {
            switch (modalType) {
              case ModalTypes.CREATE:
                return (
                  <>
                    <h3>
                      <PiKanban className={main_styles.icon} />
                      Создание kanban-доски
                    </h3>
                    <DefaultInput
                      value={newBoardTitle}
                      onChange={(e) => setNewBoardTitle(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleCreateBoard()
                      }
                      placeholder="Название проекта..."
                      autoFocus
                    />
                    <div className={navbar_styles.modalActions}>
                      <DefaultBtn
                        variant="createConfirmBtn"
                        icon={IoCheckmarkDoneOutline}
                        onClick={handleCreateBoard}
                      >
                        Создать
                      </DefaultBtn>
                      <DefaultBtn
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
                      <FaTrash className={main_styles.icon} />
                      Удаление kanban-доски
                    </h3>
                    <p>
                      Вы уверены, что хотите полностью удалить доску? Все данные
                      будут потеряны.
                    </p>
                    <div className={navbar_styles.modalActions}>
                      <DefaultBtn
                        variant="cancelBtn"
                        icon={FaTrash}
                        onClick={handleDeleteBoard}
                      >
                        Удалить
                      </DefaultBtn>
                      <DefaultBtn
                        icon={RxCross1}
                        onClick={() => setShowModal(false)}
                        className={main_styles.roundCornersBtn}
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
                      <FaTrash className={main_styles.icon} />
                      Удаление команды kanban-доски
                    </h3>
                    <p>
                      Вы уверены, что хотите удалить команду? Все данные будут
                      потеряны.
                    </p>
                    <div className={navbar_styles.modalActions}>
                      <DefaultBtn
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
                        icon={RxCross1}
                        onClick={() => setShowModal(false)}
                        className={main_styles.roundCornersBtn}
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
                      <FaTrash className={main_styles.icon} />
                      Удаление столбца kanban-доски
                    </h3>
                    <p>
                      Вы уверены, что хотите удалить столбец? Все данные будут
                      потеряны.
                    </p>
                    <div className={navbar_styles.modalActions}>
                      <DefaultBtn
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
                        icon={RxCross1}
                        onClick={() => setShowModal(false)}
                        className={main_styles.roundCornersBtn}
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
