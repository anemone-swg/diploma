import { AccountService } from "../services/account.service.js";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import { io } from "../server.js";

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

class AccountController {
  static async getAccount(req, res) {
    try {
      const { id } = req.params;
      const user = await AccountService.getAccount(id);
      res.json({ user });
    } catch (error) {
      console.error(error);
      const status = error.statusCode || 500;
      res.status(status).json({ error: error.message || "Ошибка сервера" });
    }
  }

  static async uploadAvatar(req, res) {
    try {
      await AccountService.uploadAvatar(
        req.session.user.id,
        "uploads/" + req.file.filename,
        __dirname,
      );

      res.sendStatus(204);
    } catch (error) {
      console.error(error);
      const status = error.statusCode || 500;
      res.status(status).json({ error: error.message || "Ошибка сервера" });
    }
  }

  static async updateInfo(req, res) {
    try {
      const { firstName, lastName } = req.body;
      const { id } = req.params;
      await AccountService.updateInfo(firstName, lastName, id);
      res.sendStatus(204);
    } catch (error) {
      console.error("Ошибка обновления данных:", error);
      const status = error.statusCode || 500;
      res.status(status).json({ error: error.message || "Ошибка сервера" });
    }
  }

  static async deleteAccount(req, res) {
    try {
      const { refreshToken } = req.cookies;
      const { id } = req.params;
      await AccountService.deleteAccount(refreshToken, id);
      io.emit("userDeleted");
      res.clearCookie("refreshToken");
      res.sendStatus(204);
      // req.session.destroy((err) => {
      //   if (err) {
      //     return res
      //       .status(500)
      //       .json({ error: "Ошибка при выходе из системы" });
      //   }
      //   res.clearCookie("connect.sid");
      //   io.emit("userDeleted");
      //   res.sendStatus(204);
      // });
    } catch (error) {
      console.error("Ошибка удаления аккаунта:", error);
      const status = error.statusCode || 500;
      res.status(status).json({ error: error.message || "Ошибка сервера" });
    }
  }

  static async changeLogin(req, res) {
    try {
      const { newLogin } = req.body;
      const user = await AccountService.changeLogin(
        req.session.user.id,
        newLogin,
      );
      req.session.user.username = user.login;
      res.sendStatus(204);
    } catch (error) {
      console.error("Ошибка обновления данных:", error);
      const status = error.statusCode || 500;
      res.status(status).json({ error: error.message || "Ошибка сервера" });
    }
  }

  static async getUsersForAdmin(req, res) {
    try {
      if (req.session.user?.role !== "admin") {
        return res.status(403).json({ error: "Доступ запрещён" });
      }

      const users = await AccountService.getUsersForAdmin(req.session.user.id);

      res.json({ users });
    } catch (error) {
      console.error(
        "Ошибка получения пользователей для администратора:",
        error,
      );
      const status = error.statusCode || 500;
      res.status(status).json({ error: error.message || "Ошибка сервера" });
    }
  }

  static async deleteUserByAdmin(req, res) {
    try {
      if (req.session.user?.role !== "admin") {
        return res.status(403).json({ error: "Доступ запрещён" });
      }

      const { userId } = req.body;
      await AccountService.deleteAccount(userId);

      io.emit("userDeleted");
      res.sendStatus(204);
    } catch (error) {
      console.error("Ошибка при удалении аккаунта администратором:", error);
      const status = error.statusCode || 500;
      res.status(status).json({ error: error.message || "Ошибка сервера" });
    }
  }
}

export { AccountController, upload };
