import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db.js";

class Column extends Model {}

Column.init(
  {
    id_column: {
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
          msg: "Название столбца должно содержать от 1 до 50 символов",
        },
      },
    },
    color: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "default",
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_team: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Column",
    tableName: "columns",
    timestamps: false,
  },
);

export default Column;
