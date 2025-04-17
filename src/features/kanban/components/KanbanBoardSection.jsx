import React, { useState } from "react";
import { FaEdit, FaPlus } from "react-icons/fa";
import styles from "../../../styles/App.module.css";
import KanbanColumn from "./KanbanColumn.jsx";
import DefaultBtn from "../../../components/ui/DefaultBtn.jsx";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { RxCross1 } from "react-icons/rx";
import DefaultInput from "../../../components/ui/DefaultInput.jsx";

/*const KanbanBoardSection = ({
  boards,
  showColumnInput,
  newColumnTitle,
  setShowColumnInput,
  setNewColumnTitle,
  setBoards,
}) => {
  const [newTeamTitle, setNewTeamTitle] = useState("newteam");

  // Создание колонки
  const handleCreateColumn = (boardId) => {
    if (newColumnTitle.trim()) {
      setBoards(
        boards.map((board) => {
          if (board.id === boardId) {
            return {
              ...board,
              columns: [
                ...board.columns,
                {
                  id: Date.now(),
                  title: newColumnTitle,
                  tasks: [],
                },
              ],
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
    <div>
      {boards.map((board) => (
        <div key={board.id}>
          <h2>{board.title}</h2>
          <div className={styles.board}>
            <div className={styles.boardHeader}>
              <h3 className={styles.teamTitle}>{newTeamTitle}</h3>
              <button
                className={`${styles.defaultBtn} ${styles.addColumnBtn}`}
                onClick={() => setShowColumnInput(true)}
              >
                <FaPlus className={styles.icon} />
                Добавить столбец
              </button>
            </div>

            <hr />

            {showColumnInput && (
              <div className={styles.columnInputContainer}>
                <DefaultInput
                  value={newColumnTitle}
                  onChange={(e) => setNewColumnTitle(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && handleCreateColumn(board.id)
                  }
                  placeholder="Название столбца..."
                  autoFocus
                />
                <div className={styles.columnInputActions}>
                  <DefaultBtn
                    variant="createConfirmBtn"
                    icon={IoCheckmarkDoneOutline}
                    onClick={() => handleCreateColumn(board.id)}
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
              {board.columns.map((column) => (
                <KanbanColumn key={column.id} column={column} />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};*/

const KanbanBoardSection = ({
  boards,
  showColumnInput,
  newColumnTitle,
  setShowColumnInput,
  setNewColumnTitle,
  setBoards,
  newBoardTitle,
  setNewBoardTitle,
}) => {
  const [editingBoardId, setEditingBoardId] = useState(null);
  const [editingTeamId, setEditingTeamId] = useState(null);
  const [teamTitle, setTeamTitle] = useState("");

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

  const handleBoardTitleChange = (boardId, newTitle) => {
    if (newTitle.trim()) {
      setBoards(
        boards.map((b) => (b.id === boardId ? { ...b, title: newTitle } : b)),
      );
    }
  };

  return (
    <div>
      {boards.map((board) => (
        <div key={board.id}>
          <div className={styles.titleProject}>
            {editingBoardId === board.id ? (
              <DefaultInput
                value={newBoardTitle}
                onChange={(e) => setNewBoardTitle(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleBoardTitleChange(board.id, newBoardTitle);
                    setEditingBoardId(null);
                  }
                }}
                placeholder="Название проекта..."
                autoFocus
                onBlur={() => {
                  handleBoardTitleChange(board.id, newBoardTitle);
                  setEditingBoardId(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    setEditingBoardId(null);
                  }
                }}
              />
            ) : (
              <h2
                className={styles.boardTitle}
                onClick={() => {
                  setNewBoardTitle(board.title);
                  setEditingBoardId(board.id);
                }}
              >
                <FaEdit
                  className={styles.icon}
                  style={{ verticalAlign: "baseline" }}
                />
                <span>Название проекта: </span>
                {board.title}
              </h2>
            )}
          </div>

          {board.teams.map((team) => (
            <div key={team.id} className={styles.board}>
              <div className={styles.boardHeader}>
                {editingTeamId === team.id ? (
                  <DefaultInput
                    value={teamTitle}
                    onChange={(e) => setTeamTitle(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleTeamTitleChange(board.id, team.id, teamTitle);
                        setEditingTeamId(null);
                      }
                    }}
                    placeholder="Название команды..."
                    autoFocus
                    onBlur={() => {
                      handleTeamTitleChange(board.id, team.id, teamTitle);
                      setEditingTeamId(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") {
                        setEditingTeamId(null);
                      }
                    }}
                  />
                ) : (
                  <h3
                    className={styles.teamTitle}
                    onClick={() => {
                      setTeamTitle(team.title);
                      setEditingTeamId(team.id);
                    }}
                  >
                    <FaEdit className={styles.icon} /> {team.title}
                  </h3>
                )}

                <button
                  className={`${styles.defaultBtn} ${styles.roundCornersBtn}`}
                  onClick={() => setShowColumnInput(team.id)}
                >
                  <FaPlus className={styles.icon} />
                  Добавить столбец
                </button>
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
          ))}

          <DefaultBtn
            onClick={() => handleAddTeam(board.id)}
            className={styles.roundCornersBtn}
            icon={FaPlus}
          >
            Добавить команду
          </DefaultBtn>
        </div>
      ))}
    </div>
  );
};

export default KanbanBoardSection;
