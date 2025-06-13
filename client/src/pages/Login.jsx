import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/AuthAndRegService.js";
import styles from "../styles/Login.module.css";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const role = await loginUser(username, password);
      if (role) {
        alert("Авторизация успешна!");
        onLogin(role);
        navigate(role === "admin" ? "/admin" : "/home");
      }
    } catch (error) {
      setError(error.message);
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
          <button className={styles.logButton} type="submit">
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
