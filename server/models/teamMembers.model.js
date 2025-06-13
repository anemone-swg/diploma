import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db.js"; // путь подкорректируй под себя

class TeamMembers extends Model {}

TeamMembers.init(
  {
    id_teamMember: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    id_teamOfProject: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "TeamMembers",
    tableName: "teamsMembers",
    timestamps: false,
  },
);

export default TeamMembers;
