import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/AuthAndRegService.js"; // Импортируем сервис
import styles from "../styles/Login.module.css";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Для ошибок авторизации
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Сброс ошибки перед отправкой

    try {
      const responseData = await loginUser(username, password); // Вызов сервиса
      if (responseData.success) {
        alert("Авторизация успешна!");
        onLogin();
        navigate("/home");
      }
    } catch (error) {
      setError(error.message); // Устанавливаем ошибку
    }
  };

  useEffect(() => {
    document.body.classList.add(styles.authBody);

    return () => {
      document.body.classList.remove(styles.authBody);
    };
  }, []);

  return (
    <section>
      <div className={styles.loginContainer}>
        <h2>Авторизация</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="username">Имя пользователя</label>
            <input
              type="text"
              className={styles.username}
              name="username"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">Пароль</label>
            <input
              type="password"
              className={styles.password}
              name="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button className={styles.logbutton} type="submit">
            Войти
          </button>
          <Link to="/register" className={styles.reg}>
            Зарегистрироваться
          </Link>
          {error && <p className={styles.failReg}>{error}</p>}{" "}
        </form>
      </div>
    </section>
  );
};

export default Login;
