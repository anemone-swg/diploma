import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db.js";

class Token extends Model {}

Token.init(
  {
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    refreshToken: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Token",
    tableName: "tokens",
    timestamps: false,
  },
);

export default Token;
