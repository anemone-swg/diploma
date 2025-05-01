import { DataTypes, Model } from "sequelize";
import sequelize from "../db.js"; // путь подкорректируй под себя

class Project extends Model {}

Project.init(
  {
    id_project: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        len: {
          args: [1, 20],
          msg: "Название проекта должно содержать от 1 до 20 символов",
        },
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Project",
    tableName: "projects",
    timestamps: false, // если ты не используешь автоматическое createdAt/updatedAt
  },
);

export default Project;
