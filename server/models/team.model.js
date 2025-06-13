import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db.js";

class Team extends Model {}

Team.init(
  {
    id_team: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        len: {
          args: [1, 50],
          msg: "Название команды должно содержать от 1 до 50 символов",
        },
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    id_project: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Team",
    tableName: "teams",
    timestamps: false,
  },
);

export default Team;
