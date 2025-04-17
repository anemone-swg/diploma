import React, { useEffect } from "react";
import styles from "../../styles/App.module.css";
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
}) => {
  // Эффект для закрытия модалки
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (e.target.classList.contains(styles.modal)) {
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
      /*const newBoard = {
        id: Date.now(),
        title: newBoardTitle,
        columns: [],
      };*/
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

  return (
    <div className={`${styles.modal} ${showModal ? styles.activeModal : ""}`}>
      {showModal && (
        <div className={styles.modalContent}>
          {modalType === ModalTypes.CREATE ? (
            // Модалка создания доски
            <>
              <h3>
                <PiKanban className={styles.icon} />
                Создание kanban-доски
              </h3>
              <DefaultInput
                value={newBoardTitle}
                onChange={(e) => setNewBoardTitle(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleCreateBoard()}
                placeholder="Название проекта..."
                autoFocus
              />
              <div className={styles.modalActions}>
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
          ) : (
            // Модалка удаления доски
            <>
              <h3>
                <FaTrash className={styles.icon} />
                Удаление kanban-доски
              </h3>
              <p>
                Вы уверены, что хотите полностью удалить доску? Все данные будут
                потеряны.
              </p>
              <div className={styles.modalActions}>
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
                  className={styles.roundCornersBtn}
                >
                  Отмена
                </DefaultBtn>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ModalWindow;
