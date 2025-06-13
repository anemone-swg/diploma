import { User } from "../models/export.js";
import fs from "fs";
import path from "path";
import { Op } from "sequelize";

class AccountService {
  static async getAccount(userId) {
    const user = await User.findByPk(userId, {
      attributes: ["login", "email", "avatar", "firstName", "lastName"],
    });

    if (!user) {
      const error = new Error("Пользователь не найден");
      error.statusCode = 404;
      throw error;
    }

    if (user.avatar) {
      user.avatar = `${process.env.AVATAR_PATH}${user.avatar}`;
    }

    return user;
  }

  static async uploadAvatar(userId, avatarPath, __dirname) {
    const currentUser = await User.findByPk(userId);

    if (currentUser.avatar) {
      fs.unlink(path.join(__dirname, "..", currentUser.avatar), (err) => {
        if (err) {
          console.error("Ошибка удаления старого аватара:", err);
        }
      });
    }

    await User.update({ avatar: avatarPath }, { where: { id_user: userId } });
  }

  static async updateInfo(firstName, lastName, userId) {
    const finishedFirstName = firstName?.trim() || null;
    const finishedLastName = lastName?.trim() || null;

    if (
      !/^[a-zA-Zа-яА-ЯёЁ]{2,20}$/u.test(finishedFirstName) ||
      !/^[a-zA-Zа-яА-ЯёЁ]{2,20}$/u.test(finishedLastName)
    ) {
      const error = new Error(
        "Имя и фамилия должны содержать только буквы и быть длиной 2–20 символов",
      );
      error.statusCode = 400;
      throw error;
    }

    const user = await User.findByPk(userId);
    if (!user) {
      const error = new Error("Пользователь не найден");
      error.statusCode = 404;
      throw error;
    }
    user.firstName = finishedFirstName;
    user.lastName = finishedLastName;
    await user.save();
    return user;
  }

  static async deleteAccount(userId) {
    const user = await User.findByPk(userId);
    if (!user) {
      const error = new Error("Пользователь не найден");
      error.statusCode = 404;
      throw error;
    }

    if (user.avatar) {
      fs.unlink(path.join(__dirname, "..", user.avatar), (err) => {
        if (err) console.error("Ошибка удаления старого аватара:", err);
      });
    }

    await user.destroy();
  }

  static async changeLogin(userId, newLogin) {
    const finishedNewLogin = newLogin?.trim() || null;

    if (
      !finishedNewLogin ||
      finishedNewLogin.length < 2 ||
      finishedNewLogin.length > 20
    ) {
      const error = new Error("Логин должен быть длиной от 2 до 20 символов");
      error.statusCode = 400;
      throw error;
    }

    const loginRegex = /^[a-zA-Z0-9_-]+$/;
    if (!loginRegex.test(finishedNewLogin)) {
      const error = new Error(
        "Логин может содержать только латинские буквы, цифры, подчёркивания и тире",
      );
      error.statusCode = 400;
      throw error;
    }

    const existingUser = await User.findOne({
      where: {
        login: finishedNewLogin,
        id_user: { [Op.ne]: userId },
      },
    });

    if (existingUser) {
      const error = new Error("Данный логин уже занят");
      error.statusCode = 400;
      throw error;
    }

    const user = await User.findByPk(userId);
    user.login = finishedNewLogin;
    await user.save();
    return user;
  }

  static async getUsersForAdmin(userId) {
    const users = await User.findAll({
      where: {
        id_user: {
          [Op.ne]: userId,
        },
        role: {
          [Op.ne]: "admin",
        },
      },
      attributes: [
        "id_user",
        "firstName",
        "lastName",
        "login",
        "email",
        "role",
        "avatar",
      ],
    });

    return users.forEach((user) => {
      if (user.avatar && !user.avatar.startsWith("http")) {
        user.avatar = `${process.env.AVATAR_PATH}${user.avatar}`;
      }
    });
  }
}

export { AccountService };
