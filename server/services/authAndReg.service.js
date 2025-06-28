import { User } from "../models/export.js";
import bcrypt from "bcrypt";

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

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      login: username,
      email,
      password: hashedPassword,
    });
  }

  static async login(username, password) {
    const user = await User.findOne({ where: { login: username } });
    if (!user) {
      throw new Error("Пользователя с таким логином не существует.");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Неверный пароль.");
    }

    return user;
  }
}

export { AuthAndRegService };
