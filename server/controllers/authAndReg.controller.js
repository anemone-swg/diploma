import { AuthAndRegService } from "../services/authAndReg.service.js";
import { io } from "../server.js";

class AuthAndRegController {
  static async registration(req, res) {
    try {
      const { username, email, password, confirmPassword } = req.body;
      await AuthAndRegService.registration(
        username,
        email,
        password,
        confirmPassword,
      );
      io.emit("userRegistered");
      res.sendStatus(204);
    } catch (error) {
      console.error("Registration error:", error);
      res
        .status(500)
        .json({ error: error.message || "Ошибка при регистрации" });
    }
  }

  static async login(req, res) {
    try {
      const { username, password } = req.body;
      const user = await AuthAndRegService.login(username, password);
      req.session.user = {
        id: user.id_user,
        username: user.login,
        email: user.email,
        role: user.role,
      };
      res.json({ role: req.session.user.role });
    } catch (error) {
      console.error("Login error:", error);
      res
        .status(500)
        .json({ error: error.message || "Ошибка при аутентификации" });
    }
  }

  static async checkAuth(req, res) {
    try {
      const user = req.session.user;

      res.json({
        isAuthenticated: !!user,
        role: user ? user.role : null,
      });
    } catch (error) {
      console.error("Check Authorization error:", error);
      res.status(500).json({ error: "Ошибка при проверке авторизации" });
    }
  }

  static async logout(req, res) {
    req.session.destroy((err) => {
      if (err) {
        return res.send("Error logging out");
      }
      res.clearCookie("connect.sid");
      res.sendStatus(204);
    });
  }
}

export { AuthAndRegController };
