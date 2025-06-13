import { User } from "../models/export.js";

export const isAuthenticated = async (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Не авторизован" });
  }

  try {
    const userInDb = await User.findByPk(req.session.user.id);

    if (!userInDb) {
      req.session.destroy(() => {
        res.clearCookie("connect.sid");
        return res.status(440).json({
          error: "Аккаунт удалён",
        });
      });
    } else {
      next();
    }
  } catch (error) {
    console.error("Ошибка проверки сессии:", error);
    return res.status(500).json({ error: "Ошибка сервера" });
  }
};
