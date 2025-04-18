import React from "react";
import { FaEdit } from "react-icons/fa";
import DefaultInput from "./DefaultInput.jsx";
import main_styles from "../../styles/App.module.css";
import title_styles from "./EditableTitle.module.css";

const EditableTitle = ({
  item,
  isEditing,
  title,
  placeholder,
  onEditStart,
  onEditEnd,
  onChange,
  onTitleChange,
  level = 2, // h2 по умолчанию, можно передать 3 для h3
}) => {
  const HeadingTag = `h${level}`;

  return isEditing ? (
    <DefaultInput
      value={title}
      onChange={(e) => onTitleChange(e.target.value)}
      onKeyPress={(e) => {
        if (e.key === "Enter") {
          onChange(item.id, title);
          onEditEnd();
        }
      }}
      placeholder={placeholder}
      autoFocus
      onBlur={() => {
        onChange(item.id, title);
        onEditEnd();
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          onEditEnd();
        }
      }}
    />
  ) : (
    <HeadingTag
      className={
        level === 2 ? title_styles.boardTitle : title_styles.smallTitle
      }
      onClick={() => {
        onTitleChange(item.title);
        onEditStart(item.id);
      }}
    >
      <FaEdit
        className={main_styles.icon}
        style={{ verticalAlign: level === 2 ? "baseline" : "middle" }}
      />
      {level === 2 && <span>Название проекта: </span>}
      {item.title}
    </HeadingTag>
  );
};

export default EditableTitle;
