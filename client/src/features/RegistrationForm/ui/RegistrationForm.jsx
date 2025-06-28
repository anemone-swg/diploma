import React, { useState } from "react";
import styles from "@/shared/lib/classNames/LogAndReg.module.css";
import { useNavigate } from "react-router-dom";
import DefaultInput from "@/shared/ui/DefaultInput.jsx";
import DefaultBtn from "@/shared/ui/DefaultBtn.jsx";
import { registerUser } from "@/features/RegistrationForm/modal/api/registerUser.js";

const RegistrationForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await registerUser(username, email, password, confirmPassword);
      alert("Регистрация успешна.");
      navigate("/login");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.inputGroup}>
        <label htmlFor="username">Имя пользователя</label>
        <DefaultInput
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
        <DefaultInput
          type="email"
          name="email"
          id="email"
          className={styles.email}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          maxLength={255}
          required
        />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="password">Пароль</label>
        <DefaultInput
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
        <DefaultInput
          type="password"
          name="confirmPassword"
          id="confirmPassword"
          className={styles.confirmPassword}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>
      <DefaultBtn className={styles.logButton} type="submit">
        Зарегистрироваться
      </DefaultBtn>
      {error && <p className={styles.failReg}>{error}</p>}
    </form>
  );
};

export default RegistrationForm;
