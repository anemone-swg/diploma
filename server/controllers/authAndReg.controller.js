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
      const userData = await AuthAndRegService.login(username, password);
      // req.session.user = {
      //   id: user.id_user,
      //   username: user.login,
      //   email: user.email,
      //   role: user.role,
      // };
      // res.json({ role: req.session.user.role });
      res.cookie("refreshToken", userData.refreshToken, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 дней
      });
      res.json(userData);
    } catch (error) {
      console.error("Login error:", error);
      res
        .status(500)
        .json({ error: error.message || "Ошибка при аутентификации" });
    }
  }

  // static async checkAuth(req, res) {
  //   try {
  //     const user = req.session.user;
  //
  //     res.json({
  //       isAuthenticated: !!user,
  //       role: user ? user.role : null,
  //     });
  //   } catch (error) {
  //     console.error("Check Authorization error:", error);
  //     res.status(500).json({ error: "Ошибка при проверке авторизации" });
  //   }
  // }

  static async logout(req, res) {
    // req.session.destroy((err) => {
    //   if (err) {
    //     return res.send("Error logging out");
    //   }
    //   res.clearCookie("connect.sid");
    //   res.sendStatus(204);
    // });
    try {
      const { refreshToken } = req.cookies;
      await AuthAndRegService.logout(refreshToken);
      res.clearCookie("refreshToken");
      res.sendStatus(204);
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({ error: error.message || "Ошибка при выходе" });
    }
  }

  static async activate(req, res) {
    try {
      const activationLink = req.params.link;
      await AuthAndRegService.activate(activationLink);
      return res.redirect(process.env.CLIENT_ORIGIN);
    } catch (error) {
      console.error("Ошибка активации аккаунта:", error);
      res
        .status(500)
        .json({ error: error.message || "Ошибка при активации аккаунта" });
    }
  }

  static async refresh(req, res) {
    try {
      const { refreshToken } = req.cookies;
      const userData = await AuthAndRegService.refresh(refreshToken);
      res.cookie("refreshToken", userData.refreshToken, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 дней
      });
      res.json(userData);
    } catch (error) {
      console.error("Refresh token error:", error);
      res.status(500).json({ error: error.message || "Refresh token error" });
    }
  }
}

export { AuthAndRegController };
