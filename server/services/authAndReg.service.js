import { User } from "../models/export.js";
import MailService from "./mail.service.js";
import bcrypt from "bcrypt";
import { v4 } from "uuid";
import { TokenService } from "./token.service.js";

class AuthAndRegService {
  static async registration(username, email, password, confirmPassword) {
    if (password !== confirmPassword) {
      throw new Error("Пароли не совпадают.");
    }

    const isPasswordValid = (password) => {
      return (
        /[0-9]/.test(password) &&
        /[A-Z]/.test(password) &&
        /[a-z]/.test(password) &&
        /[\W_]/.test(password)
      );
    };

    if (!isPasswordValid(password)) {
      throw new Error(
        "Пароль должен содержать хотя бы одну цифру, заглавную и строчную буквы, один специальный символ.",
      );
    }

    const existingUser = await User.findOne({ where: { login: username } });
    if (existingUser) {
      throw new Error("Пользователь с таким логином уже существует.");
    }

    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      throw new Error("Пользователь с такой почтой уже существует.");
    }

    const activationLink = v4();
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      login: username,
      email,
      password: hashedPassword,
      activationLink,
    });
    await MailService.sendActivationMail(
      email,
      `${process.env.API_URL}/api/activate/${activationLink}`,
    );
  }

  static async activate(activationLink) {
    const user = await User.findOne({ where: { activationLink } });
    if (!user) {
      throw new Error("Некорректная ссылка активации");
    }
    user.isActivated = true;
    await user.save();
  }

  static async login(username, password) {
    const user = await User.findOne({ where: { login: username } });
    if (!user) {
      throw new Error("Пользователя с таким логином не существует.");
    }
    if (!user.isActivated) {
      throw new Error("Проверьте почту. Аккаунт не активирован.");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Неверный пароль.");
    }

    const tokens = TokenService.generateTokens({
      id_user: user.id_user,
      email: user.email,
      isActivated: user.isActivated,
      username: user.login,
      role: user.role,
    });
    await TokenService.saveToken(user.id_user, tokens.refreshToken);
    return {
      ...tokens,
      user: {
        id_user: user.id_user,
        email: user.email,
        isActivated: user.isActivated,
        username: user.login,
        role: user.role,
      },
    };
  }

  static async logout(refreshToken) {
    await TokenService.removeToken(refreshToken);
  }

  static async refresh(refreshToken) {
    if (!refreshToken) {
      const error = new Error("Пользователь не авторизован.");
      error.statusCode = 401;
      throw error;
    }
    const userData = TokenService.validateRefreshToken(refreshToken);
    const tokenInDb = TokenService.findToken(refreshToken);
    if (!tokenInDb || !userData) {
      const error = new Error("Пользователь не авторизован.");
      error.statusCode = 401;
      throw error;
    }

    const user = await User.findByPk(userData.id_user);
    const tokens = TokenService.generateTokens({
      id_user: user.id_user,
      email: user.email,
      isActivated: user.isActivated,
      username: user.login,
      role: user.role,
    });
    await TokenService.saveToken(user.id_user, tokens.refreshToken);
    return {
      ...tokens,
      user: {
        id_user: user.id_user,
        email: user.email,
        isActivated: user.isActivated,
        username: user.login,
        role: user.role,
      },
    };
  }
}

export { AuthAndRegService };
