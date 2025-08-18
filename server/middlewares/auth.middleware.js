import { TokenService } from "../services/token.service.js";

export const isAuthenticated = async (req, res, next) => {
  // if (!req.session.user) {
  //   return res.status(401).json({ error: "Не авторизован" });
  // }
  //
  // try {
  //   const userInDb = await User.findByPk(req.session.user.id);
  //
  //   if (!userInDb) {
  //     req.session.destroy(() => {
  //       res.clearCookie("connect.sid");
  //       return res.status(440).json({
  //         error: "Аккаунт удалён",
  //       });
  //     });
  //   } else {
  //     next();
  //   }
  // } catch (error) {
  //   console.error("Ошибка проверки сессии:", error);
  //   return res.status(500).json({ error: "Ошибка сервера" });
  // }

  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      return res.status(401).json({ error: "Не авторизован" });
    }
    const accessToken = authorizationHeader.split(" ")[1];
    if (!accessToken) {
      return res.status(401).json({ error: "Не авторизован" });
    }
    const userData = TokenService.validateAccessToken(accessToken);
    if (!userData) {
      return res.status(401).json({ error: "Не авторизован" });
    }
    req.user = userData;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Не авторизован" });
  }
};
