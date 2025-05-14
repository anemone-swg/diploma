import { DataTypes, Model } from "sequelize";
import sequelize from "../db.js";

class User extends Model {}

User.init(
  {
    id_user: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: {
      type: DataTypes.STRING(20),
      allowNull: true,
      validate: {
        is: /^[a-zA-Zа-яА-ЯёЁ]{2,20}$/u, // Поддержка кириллицы и латиницы
      },
    },
    lastName: {
      type: DataTypes.STRING(20),
      allowNull: true,
      validate: {
        is: /^[a-zA-Zа-яА-ЯёЁ]{2,20}$/u,
      },
    },
    login: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        is: /.*[0-9].*/,
        containsUpperCase: (value) => {
          if (!/[A-Z]/.test(value)) {
            throw new Error(
              "Password must contain at least one uppercase letter.",
            );
          }
        },
        containsLowerCase: (value) => {
          if (!/[a-z]/.test(value)) {
            throw new Error(
              "Password must contain at least one lowercase letter.",
            );
          }
        },
        containsSpecialChar: (value) => {
          if (!/\W/.test(value)) {
            throw new Error(
              "Password must contain at least one special character.",
            );
          }
        },
      },
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    avatar: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM("user", "admin"),
      defaultValue: "user",
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: false,
  },
);

export default User;
