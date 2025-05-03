import React, { useState } from "react";
import titleProject_styles from "./TitleProject.module.css";
import EditableTitle from "../../../../components/ui/EditableTitle.jsx";
import { renameProject } from "@/services/ProjectPlannerService.js";

const TitleProject = ({
  board,
  newBoardTitle,
  setNewBoardTitle,
  setBoards,
}) => {
  const [editingBoardId, setEditingBoardId] = useState(null);

  const handleBoardTitleChange = async (boardId, newTitle) => {
    if (newTitle.trim()) {
      try {
        await renameProject(boardId, newTitle);

        setBoards((prevBoards) =>
          prevBoards.map((b) =>
            b.id === boardId ? { ...b, title: newTitle } : b,
          ),
        );
      } catch (error) {
        console.error(error);
        alert("Ошибка при переименовании доски (проекта)");
      }
    }
  };

  return (
    <div className={titleProject_styles.titleProject}>
      <EditableTitle
        item={board}
        isEditing={editingBoardId === board.id}
        title={newBoardTitle}
        placeholder="Название проекта..."
        onEditStart={(id) => setEditingBoardId(id)}
        onEditEnd={() => setEditingBoardId(null)}
        onTitleChange={setNewBoardTitle}
        onChange={(id, newTitle) => handleBoardTitleChange(id, newTitle)}
        level={2}
      />
    </div>
  );
};

export default TitleProject;
