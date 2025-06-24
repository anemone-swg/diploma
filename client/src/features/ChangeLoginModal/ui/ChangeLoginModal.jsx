import React from "react";
import modal_styles from "@/features/ModalWindow/ui/ModalWindow.module.css";
import styles from "@/widgets/HomePageSection/ui/HomePageSection.module.css";
import main_styles from "@/app/styles/App.module.css";
import { GoPencil } from "react-icons/go";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { RxCross1 } from "react-icons/rx";
import DefaultBtn from "@/shared/ui/DefaultBtn.jsx";
import btn_styles from "@/shared/ui/DefaultBtn.module.css";
import DefaultInput from "@/shared/ui/DefaultInput.jsx";

const ChangeLoginModal = ({
  isOpen,
  newLogin,
  onClose,
  onChange,
  onSave,
  error,
  message,
  messageVisible,
}) => {
  return (
    <div
      className={`${modal_styles.modal} ${isOpen ? modal_styles.activeModal : ""}`}
    >
      {isOpen && (
        <div className={modal_styles.modalContent}>
          <h3>
            <GoPencil className={main_styles.icon} />
            Введите новый логин
          </h3>
          <DefaultInput
            maxLength={21}
            value={newLogin}
            onChange={onChange}
            placeholder="Новый логин..."
          />
          <div
            className={`${styles.messageContainer} ${!messageVisible ? styles.hidden : ""}`}
          >
            {error && <p className={styles.errorMessage}>{error}</p>}
            {message && <p className={styles.successMessage}>{message}</p>}
          </div>
          <div className={modal_styles.modalActions}>
            <DefaultBtn
              variant="confirmBtn"
              onClick={onSave}
              icon={IoCheckmarkDoneOutline}
              className={btn_styles.roundCornersBtn}
            >
              Сохранить
            </DefaultBtn>
            <DefaultBtn
              variant="cancelBtn"
              onClick={onClose}
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
