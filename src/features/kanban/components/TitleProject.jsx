import React, { useState } from "react";
import titleProject_styles from "./TitleProject.module.css";
import EditableTitle from "../../../components/ui/EditableTitle.jsx";

const TitleProject = ({
  board,
  newBoardTitle,
  setNewBoardTitle,
  setBoards,
  boards,
}) => {
  const [editingBoardId, setEditingBoardId] = useState(null);

  const handleBoardTitleChange = (boardId, newTitle) => {
    if (newTitle.trim()) {
      setBoards(
        boards.map((b) => (b.id === boardId ? { ...b, title: newTitle } : b)),
      );
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
