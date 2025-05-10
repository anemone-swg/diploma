import { Router } from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { User } from "../models/export.js";
import { isAuthenticated } from "../middlewares.js";
import { Op } from "sequelize";

const router = Router();
router.use("/account", isAuthenticated);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./server/uploads/"),
  filename: (req, file, cb) =>
    cb(
      null,
      req.session.user.username + "-" + Date.now() + "-" + file.originalname,
    ),
});

const upload = multer({ storage });

router.post(
  "/account/upload-avatar",
  upload.single("avatar"),
  async (req, res) => {
    const avatarPath = "uploads/" + req.file.filename;

    try {
      // const currentUser = await User.findOne({
      //   where: { login: req.session.user.username },
      // });
      const currentUser = await User.findByPk(req.session.user.id);

      if (currentUser.avatar) {
        fs.unlink(path.join(__dirname, "..", currentUser.avatar), (err) => {
          if (err) console.error("Ошибка удаления старого аватара:", err);
        });
      }

      await User.update(
        { avatar: avatarPath },
        { where: { id_user: req.session.user.id } },
      );

      res.json({ success: true, avatarPath });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false });
    }
  },
);

router.get("/account", async (req, res) => {
  try {
    const user = await User.findByPk(req.session.user.id, {
      attributes: ["login", "email", "avatar", "firstName", "lastName"],
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Если аватар есть, добавляем полный путь
    if (user.avatar) {
      user.avatar = `http://localhost:5000/uploads/${user.avatar}`;
    }

    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/account/update", async (req, res) => {
  try {
    const { firstName, lastName } = req.body;

    const finishedFirstName = firstName?.trim() || null;
    const finishedLastName = lastName?.trim() || null;

    if (
      !/^[a-zA-Zа-яА-ЯёЁ]{2,20}$/u.test(finishedFirstName) ||
      !/^[a-zA-Zа-яА-ЯёЁ]{2,20}$/u.test(finishedLastName)
    ) {
      return res.status(400).json({
        message:
          "Имя и фамилия должны содержать только буквы и быть длиной 2-20 символов",
      });
    }

    const user = await User.findByPk(req.session.user.id);
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }
    user.firstName = finishedFirstName;
    user.lastName = finishedLastName;
    await user.save();

    res.json({ message: "Данные обновлены успешно", user });
  } catch (error) {
    console.error("Ошибка обновления данных:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

router.delete("/account/delete", async (req, res) => {
  try {
    const user = await User.findByPk(req.session.user.id);
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    if (user.avatar) {
      fs.unlink(path.join(__dirname, "..", user.avatar), (err) => {
        if (err) console.error("Ошибка удаления старого аватара:", err);
      });
    }

    // Удаляем пользователя из базы данных
    await user.destroy();

    // Очищаем сессию и куки
    req.session.destroy((err) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Ошибка при выходе из системы" });
      }
      res.clearCookie("connect.sid");
      res.json({ message: "Аккаунт удалён успешно" });
    });
  } catch (error) {
    console.error("Ошибка при удалении аккаунта:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

router.put("/account/change_login", async (req, res) => {
  try {
    const { newLogin } = req.body;
    const finishedNewLogin = newLogin?.trim() || null;

    if (
      !finishedNewLogin ||
      finishedNewLogin.length < 2 ||
      finishedNewLogin.length > 20
    ) {
      return res.status(400).json({
        message: "Логин должен быть длиной от 2 до 20 символов",
      });
    }

    // Проверка на допустимые символы
    const loginRegex = /^[a-zA-Z0-9_-]+$/;
    if (!loginRegex.test(finishedNewLogin)) {
      return res.status(400).json({
        message:
          "Логин может содержать только латинские буквы, цифры, подчёркивания и тире",
      });
    }

    // Проверка уникальности
    const existingUser = await User.findOne({
      where: {
        login: finishedNewLogin,
        id_user: { [Op.ne]: req.session.user.id },
      },
    });

    if (existingUser) {
      return res.status(409).json({ message: "Данный логин уже занят" });
    }

    const user = await User.findByPk(req.session.user.id);
    user.login = finishedNewLogin;
    await user.save();

    req.session.user.username = finishedNewLogin;

    res.json({ message: "Логин успешно обновлён", user });
  } catch (error) {
    console.error("Ошибка обновления логина:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

export default router;
