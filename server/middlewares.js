// export const isAuthenticated = (req, res, next) => {
//   if (!req.session.user) {
//     return res.status(401).json({ success: false, message: "Не авторизован" });
//   }
//   next();
// };

import { User } from "./models/Export.js";

export const isAuthenticated = async (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ success: false, message: "Не авторизован" });
  }

  try {
    const userInDb = await User.findByPk(req.session.user.id);

    if (!userInDb) {
      req.session.destroy(() => {
        res.clearCookie("connect.sid");
        return res.status(440).json({
          success: false,
          message: "Аккаунт удалён",
        });
      });
    } else {
      next();
    }
  } catch (err) {
    console.error("Ошибка проверки сессии:", err);
    return res.status(500).json({ success: false, message: "Ошибка сервера" });
  }
};
