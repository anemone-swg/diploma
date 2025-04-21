import React from "react";
import task_styles from "./KanbanTask.module.css";
import { Draggable } from "react-beautiful-dnd";

const KanbanTask = ({ task, index }) => {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`${task_styles.task} ${
            snapshot.isDragging ? task_styles.dragging : ""
          }`}
          style={{
            ...provided.draggableProps.style,
            top: "0 !important",
            left: "0 !important",
          }}
        >
          <div className={task_styles.taskContent}>{task.content}</div>
        </div>
      )}
    </Draggable>
  );
};

export default KanbanTask;
