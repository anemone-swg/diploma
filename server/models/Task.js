import { DataTypes, Model } from "sequelize";
import sequelize from "../db.js"; // путь подкорректируй под себя

class Task extends Model {}

Task.init(
  {
    id_task: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    content: {
      type: DataTypes.STRING(500),
      allowNull: false,
      validate: {
        len: {
          args: [1, 500],
          msg: "Содержимое задачи должно содержать от 1 до 500 символов",
        },
      },
    },
    completed: {
      type: DataTypes.ENUM("in_progress", "awaiting_approval", "done"),
      allowNull: false,
      defaultValue: "in_progress",
    },
    deadline: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    id_column: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Task",
    tableName: "project_tasks",
    timestamps: false,
  },
);

export default Task;
