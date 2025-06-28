import React, { useEffect } from "react";
import styles from "@/shared/lib/classNames/LogAndReg.module.css";
import LoginForm from "@/features/LoginForm/ui/LoginForm.jsx";

const LoginPageSection = ({ onLogin }) => {
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
        <LoginForm onLogin={onLogin} />
      </div>
    </section>
  );
};

export default LoginPageSection;
