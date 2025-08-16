import React, { memo, useState } from "react";
import boards_container from "@/widgets/KanbanBoardSection/ui/ui/BoardContainer.module.css";
import kanban_styles from "@/shared/lib/classNames/Kanban.module.css";
import KanbanColumn from "@/widgets/KanbanBoardSection/ui/ui/KanbanColumn.jsx";
import EditableTitle from "@/shared/ui/EditableTitle.jsx";
import DropdownMenu from "@/features/DropdownMenu/ui/DropdownMenu.jsx";
import InputWithActions from "@/shared/ui/InputWithActions.jsx";
import { DragDropContext } from "react-beautiful-dnd";
import DefaultBtn from "@/shared/ui/DefaultBtn.jsx";
import btn_styles from "@/shared/ui/DefaultBtn.module.css";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useCollapsedState } from "@/shared/lib/hooks/useCollapsedState.js";
import { renameTeam } from "../../api/renameTeam.js";
import { createColumn } from "../../api/createColumn.js";
import { updateTaskMove } from "../../api/updateTaskMove.js";

const BoardContainer = memo(
  ({
    team,
    setDeletingTeam,
    setShowDeleteTeamModal,
    setBoards,
    board,
    setDeletingColumn,
    setShowDeleteColumnModal,
  }) => {
    const [editingTeamId, setEditingTeamId] = useState(null);
    const [teamTitle, setTeamTitle] = useState("");
    const [showColumnInput, setShowColumnInput] = useState(false);
    const [newColumnTitle, setNewColumnTitle] = useState("");
    const projectId = board.id;

    const [isCollapsed, setIsCollapsed] = useCollapsedState(team.id_team);

    const handleTeamTitleChange = (boardId, teamId, newTitle) => {
      if (newTitle.trim()) {
        renameTeam(teamId, newTitle).then(() => {
          setBoards((prevBoards) =>
            prevBoards.map((board) => {
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
        });
      }
    };

    const handleCreateColumn = async (boardId, teamId) => {
      if (newColumnTitle.trim()) {
        try {
          const createdColumn = await createColumn(newColumnTitle, teamId);

          setBoards((prevBoards) =>
            prevBoards.map((board) => {
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
                            id: createdColumn.id_column,
                            title: createdColumn.title,
                            color: createdColumn.color,
                            order: createdColumn.order,
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
        } catch (_) {
          /* empty */
        }
      }
    };

    const handleDragEnd = (result) => {
      const { destination, source } = result;

      // Если нет цели или перемещение в то же место
      if (
        !destination ||
        (destination.droppableId === source.droppableId &&
          destination.index === source.index)
      ) {
        return;
      }

      setBoards((prevBoards) => {
        return prevBoards.map((board) => ({
          ...board,
          teams: board.teams.map(async (team) => {
            // Для случая перемещения внутри одной колонки
            if (source.droppableId === destination.droppableId) {
              const column = team.columns.find(
                (col) => String(col.id) === source.droppableId,
              );
              if (!column) return team;

              const newTasks = [...column.tasks];
              const [removed] = newTasks.splice(source.index, 1);
              newTasks.splice(destination.index, 0, removed);

              return {
                ...team,
                columns: team.columns.map((col) =>
                  String(col.id) === source.droppableId
                    ? { ...col, tasks: newTasks }
                    : col,
                ),
              };
            }

            // Для перемещения между разными колонками
            const sourceColumn = team.columns.find(
              (col) => String(col.id) === source.droppableId,
            );
            const destColumn = team.columns.find(
              (col) => String(col.id) === destination.droppableId,
            );

            if (!sourceColumn || !destColumn) return team;

            const newSourceTasks = [...sourceColumn.tasks];
            const newDestTasks = [...destColumn.tasks];
            const [movedTask] = newSourceTasks.splice(source.index, 1);
            newDestTasks.splice(destination.index, 0, movedTask);

            await updateTaskMove(movedTask.id_task, destination.droppableId);

            return {
              ...team,
              columns: team.columns.map((col) => {
                if (String(col.id) === source.droppableId) {
                  return { ...col, tasks: newSourceTasks };
                }
                if (String(col.id) === destination.droppableId) {
                  return { ...col, tasks: newDestTasks };
                }
                return col;
              }),
            };
          }),
        }));
      });
    };

    return (
      <DragDropContext onDragEnd={handleDragEnd} key={board.id}>
        <div className={boards_container.board}>
          <div className={kanban_styles.elementHeader}>
            <EditableTitle
              maxLength={50}
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
            <div className={boards_container.teamBtns}>
              <DefaultBtn
                onClick={() => setIsCollapsed((prev) => !prev)}
                className={btn_styles.roundCornersBtn}
                icon={isCollapsed ? FaChevronDown : FaChevronUp}
              ></DefaultBtn>
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
          </div>

          <hr />

          {showColumnInput === team.id && (
            <InputWithActions
              maxLength={50}
              type="column"
              value={newColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)}
              onSubmit={() => handleCreateColumn(board.id, team.id)}
              onCancel={() => {
                setShowColumnInput(false);
                setNewColumnTitle("");
              }}
              placeholder="Название столбца..."
            />
          )}

          <div
            className={`${boards_container.columnsContainer} ${isCollapsed ? boards_container.collapsed : ""}`}
          >
            {team.columns.map((column) => (
              <KanbanColumn
                key={column.id}
                column={column}
                newColumnTitle={newColumnTitle}
                setNewColumnTitle={setNewColumnTitle}
                setBoards={setBoards}
                setDeletingColumn={setDeletingColumn}
                setShowDeleteColumnModal={setShowDeleteColumnModal}
                team={team}
                projectId={projectId}
              />
            ))}
          </div>
        </div>
      </DragDropContext>
    );
  },
);

export default BoardContainer;
