import { User } from "../models/export.js";
import bcrypt from "bcrypt";

class AuthAndRegService {
  static async registration(username, email, password) {
    const existingUser = await User.findOne({ where: { login: username } });
    if (existingUser) {
      throw new Error("Пользователь с таким логином уже существует");
    }

    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      throw new Error("Пользователь с такой почтой уже существует");
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
      console.log("Пользователя с таким логином не существует");
      throw new Error("Пользователя с таким логином не существует");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Неверный пароль");
      throw new Error("Неверный пароль");
    }

    return user;
  }
}

export { AuthAndRegService };
