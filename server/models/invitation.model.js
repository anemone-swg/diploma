import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db.js"; // путь подкорректируй под себя

class Invitation extends Model {}

Invitation.init(
  {
    id_invite: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    fromUserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    toUserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_project: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "accepted", "declined"),
      defaultValue: "pending",
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "Invitation",
    tableName: "invitations",
    timestamps: false,
  },
);

export default Invitation;
