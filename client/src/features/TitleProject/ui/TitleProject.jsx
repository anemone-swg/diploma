import React, { useState } from "react";
import titleProject_styles from "@/features/TitleProject/ui/TitleProject.module.css";
import EditableTitle from "@/shared/ui/EditableTitle.jsx";
import { renameProject } from "@/services/ProjectPlannerService.js";

const TitleProject = ({
  board,
  newBoardTitle,
  setNewBoardTitle,
  setBoards,
}) => {
  const [editingBoardId, setEditingBoardId] = useState(null);

  const handleBoardTitleChange = (boardId, newTitle) => {
    if (newTitle.trim()) {
      renameProject(boardId, newTitle).then(() => {
        setBoards((prevBoards) =>
          prevBoards.map((b) =>
            b.id === boardId ? { ...b, title: newTitle } : b,
          ),
        );
      });
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
