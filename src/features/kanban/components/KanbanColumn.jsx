import React from "react";
import styles from "../../../styles/App.module.css";

const KanbanColumn = ({ column }) => {
  return (
    <div className={styles.column}>
      <h3 className={styles.columnTitle}>{column.title}</h3>
      <hr />
      <div className={styles.tasksContainer}>{/* Компонент задач */}</div>
    </div>
  );
};

export default KanbanColumn;
