import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/AuthAndRegService.js";
import styles from "../styles/Login.module.css";

const Registration = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add(styles.authBody);
    return () => {
      document.body.classList.remove(styles.authBody);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Пароли не совпадают!");
      return;
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
      setError(
        "Пароль должен содержать хотя бы одну цифру, заглавную и строчную буквы, один специальный символ.",
      );
      return;
    }

    try {
      const responseData = await registerUser(
        username,
        email,
        password,
        confirmPassword,
      );
      if (responseData.success) {
        alert("Регистрация успешна!");
        navigate("/login");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <section>
      <button className={styles.backToPrev} onClick={() => navigate("/login")}>
        &#8592;
      </button>
      <div className={styles.registerContainer}>
        <h2>Регистрация</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="username">Имя пользователя</label>
            <input
              type="text"
              name="username"
              id="username"
              className={styles.username}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Электронная почта</label>
            <input
              type="email"
              name="email"
              id="email"
              className={styles.email}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">Пароль</label>
            <input
              type="password"
              name="password"
              id="password"
              className={styles.password}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="confirmPassword">Подтвердите пароль</label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              className={styles.confirmPassword}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button className={styles.logbutton} type="submit">
            Зарегистрироваться
          </button>
          {error && <p className={styles.failReg}>{error}</p>}
        </form>
      </div>
    </section>
  );
};

export default Registration;
