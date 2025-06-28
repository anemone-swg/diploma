import React, { useState } from "react";
import styles from "@/shared/lib/classNames/LogAndReg.module.css";
import { Link, useNavigate } from "react-router-dom";
import DefaultInput from "@/shared/ui/DefaultInput.jsx";
import DefaultBtn from "@/shared/ui/DefaultBtn.jsx";
import { loginUser } from "@/features/LoginForm/modal/api/loginUser.js";

const LoginForm = ({ onLogin }) => {
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
        onLogin(role);
        navigate(role === "admin" ? "/admin" : "/home");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.inputGroup}>
        <label htmlFor="username">Имя пользователя</label>
        <DefaultInput
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
        <DefaultInput
          type="password"
          className={styles.password}
          name="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <DefaultBtn className={styles.logButton} type="submit">
        Войти
      </DefaultBtn>
      <Link to="/register" className={styles.reg}>
        Зарегистрироваться
      </Link>
      {error && <p className={styles.failReg}>{error}</p>}{" "}
    </form>
  );
};

export default LoginForm;
