import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db.js"; // путь подкорректируй под себя

class TeamOfProject extends Model {}

TeamOfProject.init(
  {
    id_teamOfProject: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    id_project: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "TeamOfProject",
    tableName: "teamsOfProject",
    timestamps: false,
  },
);

export default TeamOfProject;
