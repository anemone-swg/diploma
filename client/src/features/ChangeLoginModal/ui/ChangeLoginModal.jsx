import React, { useEffect, useState } from "react";
import modal_styles from "@/shared/lib/classNames/ModalWindow.module.css";
import styles from "@/widgets/HomePageSection/ui/ui/UserInfo.module.css";
import additional_styles from "@/shared/lib/classNames/Additional.module.css";
import { GoPencil } from "react-icons/go";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { RxCross1 } from "react-icons/rx";
import DefaultBtn from "@/shared/ui/DefaultBtn.jsx";
import btn_styles from "@/shared/ui/DefaultBtn.module.css";
import DefaultInput from "@/shared/ui/DefaultInput.jsx";
import { changeUserLogin } from "@/features/ChangeLoginModal/modal/api/changeUserLogin.js";

const ChangeLoginModal = ({ isOpen, setIsOpen, onSuccess }) => {
  const [errorLogin, setErrorLogin] = useState("");
  const [messageLogin, setMessageLogin] = useState("");
  const [messageLoginVisible, setMessageLoginVisible] = useState(false);
  const [newLogin, setNewLogin] = useState("");
  const [isDisabled, setDisabled] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (e.target.classList.contains(modal_styles.modal)) {
        setIsOpen(false);
        setNewLogin("");
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [setIsOpen]);

  const handleSaveLogin = () => {
    if (setDisabled) setDisabled(true);

    changeUserLogin(newLogin)
      .then(() => {
        onSuccess();
        setErrorLogin("");
        setMessageLogin("Данные успешно сохранены!");
        setMessageLoginVisible(true);

        setTimeout(() => {
          setMessageLoginVisible(false);
          setTimeout(() => setMessageLogin(""), 500);
        }, 3000);
      })
      .catch((error) => {
        setErrorLogin(error.message);
        setMessageLoginVisible(true);
        setTimeout(() => {
          if (setMessageLoginVisible) setMessageLoginVisible(false);
          setTimeout(() => setErrorLogin && setErrorLogin(""), 500);
        }, 3000);
      })
      .finally(() => {
        if (setDisabled) {
          setTimeout(() => {
            setDisabled(false);
          }, 5000);
        }
      });
  };

  const handleCloseChangeLoginModal = () => {
    setIsOpen(false);
    setNewLogin("");
  };

  return (
    <div
      className={`${modal_styles.modal} ${isOpen ? modal_styles.activeModal : ""}`}
    >
      {isOpen && (
        <div className={modal_styles.modalContent}>
          <h3>
            <GoPencil className={additional_styles.icon} />
            Введите новый логин
          </h3>
          <DefaultInput
            maxLength={21}
            value={newLogin}
            onChange={(e) => setNewLogin(e.target.value)}
            placeholder="Новый логин..."
          />
          <div
            className={`${styles.messageContainer} ${!messageLoginVisible ? styles.hidden : ""}`}
          >
            {errorLogin && <p className={styles.errorMessage}>{errorLogin}</p>}
            {messageLogin && (
              <p className={styles.successMessage}>{messageLogin}</p>
            )}
          </div>
          <div className={modal_styles.modalActions}>
            <DefaultBtn
              variant="confirmBtn"
              onClick={handleSaveLogin}
              icon={IoCheckmarkDoneOutline}
              className={btn_styles.roundCornersBtn}
              visibleDisabled={isDisabled}
            >
              Сохранить
            </DefaultBtn>
            <DefaultBtn
              variant="cancelBtn"
              onClick={handleCloseChangeLoginModal}
              icon={RxCross1}
              className={btn_styles.roundCornersBtn}
            >
              Отмена
            </DefaultBtn>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChangeLoginModal;
