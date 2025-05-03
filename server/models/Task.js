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
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    user: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "Исполнитель не назначен",
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
