import React, { useEffect } from "react";
import styles from "@/shared/lib/classNames/LogAndReg.module.css";
import { useNavigate } from "react-router-dom";
import DefaultBtn from "@/shared/ui/DefaultBtn.jsx";
import RegistrationForm from "@/features/RegistrationForm/ui/RegistrationForm.jsx";

const RegistrationPageSection = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add(styles.authBody);
    return () => {
      document.body.classList.remove(styles.authBody);
    };
  }, []);

  return (
    <section>
      <DefaultBtn
        className={styles.backToPrev}
        onClick={() => navigate("/login")}
      >
        &#8592;
      </DefaultBtn>
      <div className={styles.registerContainer}>
        <h2>Регистрация</h2>
        <RegistrationForm />
      </div>
    </section>
  );
};

export default RegistrationPageSection;
