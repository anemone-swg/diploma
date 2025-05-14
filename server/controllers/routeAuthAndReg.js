import { Router } from "express";
import { User } from "../models/Export.js";
import bcrypt from "bcrypt";
import { isAuthenticated } from "../middlewares.js";
import { io } from "../server.js";

const router = Router();
router.use("/logout", isAuthenticated);

router.post("/register", async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Пароли не совпадают" });
  }

  try {
    const existingUser = await User.findOne({ where: { login: username } });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Пользователь с таким логином уже существует" });
    }

    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      return res
        .status(400)
        .json({ error: "Пользователь с такой почтой уже существует" });
    }

    // Хешируем пароль перед сохранением
    const hashedPassword = await bcrypt.hash(password, 10); // 10 — сложность хеширования

    await User.create({ login: username, email, password: hashedPassword });

    io.emit("userRegistered");
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Внутренняя ошибка сервера" });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { login: username } });
    if (!user) {
      console.log("No user found");
      return res
        .status(400)
        .json({ error: "Пользователя с таким логином не существует" });
    }

    // Проверяем пароль с хешем
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Incorrect password");
      return res.status(400).json({ error: "Неверный пароль" });
    }

    req.session.user = {
      id: user.id_user,
      username: user.login,
      email: user.email,
      role: user.role,
    };

    res.json({ success: true, role: req.session.user.role });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Внутренняя ошибка сервера" });
  }
});

router.get("/check-auth", (req, res) => {
  const user = req.session.user;

  res.json({
    isAuthenticated: !!user,
    role: user ? user.role : null,
  });
});

router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.send("Error logging out");
    }
    res.clearCookie("connect.sid");
    res.json({ success: true });
  });
});

export default router;
