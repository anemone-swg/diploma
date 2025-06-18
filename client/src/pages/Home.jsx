import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../services/AuthAndRegService";
import {
  changeUserLogin,
  deleteUserAccount,
  fetchUserData,
  updateUserData,
  uploadAvatar,
} from "../services/AccountService.js";
import main_styles from "../styles/App.module.css";
import styles from "../styles/Home.module.css";
import btn_styles from "@/components/ui/DefaultBtn.module.css";
import modal_styles from "@/components/shared/ModalWindow.module.css";
import defaultAvatar from "../assets/default_avatar.jpg";
import { ClipLoader } from "react-spinners";
import { FaHome } from "react-icons/fa";
import DefaultBtn from "@/components/ui/DefaultBtn.jsx";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { RxCross1 } from "react-icons/rx";
import { GoPencil } from "react-icons/go";

const Home = ({ onLogout }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [avatar, setAvatar] = useState(defaultAvatar);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [errorLogin, setErrorLogin] = useState("");
  const [message, setMessage] = useState("");
  const [messageLogin, setMessageLogin] = useState("");
  const [messageVisible, setMessageVisible] = useState(false);
  const [messageLoginVisible, setMessageLoginVisible] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isOpenChangeLoginModal, setIsOpenChangeLoginModal] = useState(false);
  const [newLogin, setNewLogin] = useState("");

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (e.target.classList.contains(modal_styles.modal)) {
        setIsOpenChangeLoginModal(false);
        setNewLogin("");
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [setIsOpenChangeLoginModal]);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = () => {
    fetchUserData().then((data) => {
      setUser(data.user);
      setAvatar(data.user.avatar || defaultAvatar);
      setFirstName(data.user.firstName || "");
      setLastName(data.user.lastName || "");
    });
  };

  const handleCloseChangeLoginModal = () => {
    setIsOpenChangeLoginModal(false);
    setNewLogin("");
  };

  const handleChangeLogin = async () => {
    try {
      if (isDisabled) return;
      setIsDisabled(true);
      await changeUserLogin(newLogin);
      await loadUserData();
      setErrorLogin("");
      setMessageLogin("Данные успешно сохранены!");
      setMessageLoginVisible(true);
      setTimeout(() => {
        setMessageLoginVisible(false);
        setTimeout(() => setMessageLogin(""), 500);
      }, 3000);
    } catch (error) {
      setMessageLoginVisible(true);
      setTimeout(() => {
        setMessageLoginVisible(false);
        setTimeout(() => setErrorLogin(""), 500);
      }, 3000);
      setErrorLogin(error.message);
    }
    setTimeout(() => {
      setIsDisabled(false);
    }, 5000);
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      uploadAvatar(file).then(() => setAvatar(imageUrl));
    }
  };

  const handleSave = async () => {
    try {
      if (isDisabled) return;
      setIsDisabled(true);
      await updateUserData({ firstName, lastName });
      setError("");
      setMessage("Данные успешно сохранены!");
      setMessageVisible(true);
      setTimeout(() => {
        setMessageVisible(false);
        setTimeout(() => setMessage(""), 500);
      }, 3000);
    } catch (error) {
      setMessageVisible(true);
      setTimeout(() => {
        setMessageVisible(false);
        setTimeout(() => setError(""), 500);
      }, 3000);
      setError(error.message);
    }
    setTimeout(() => {
      setIsDisabled(false);
    }, 5000);
  };

  const handleLogout = () => {
    logoutUser().then(() => {
      onLogout();
      navigate("/login");
    });
  };

  const handleDeleteAcc = () => {
    if (!window.confirm("Вы уверены, что хотите удалить аккаунт?")) {
      return;
    }

    deleteUserAccount().then(() => {
      alert("Аккаунт успешно удалён!");
      onLogout();
      navigate("/login");
    });
  };

  return (
    <div className={main_styles.page}>
      <h1>
        <FaHome className={main_styles.titleIcon} />
        Ваш аккаунт
      </h1>

      {user ? (
        <div>
          <div className={main_styles.moduleSection}>
            <h2>Основные данные</h2>
            <hr className={styles.prettyHr} />
            <div className={styles.profileInfo}>
              <img
                className={styles.avatar}
                src={avatar}
                alt="Avatar"
                id="avatar"
              />
              <div className={styles.details}>
                <p>Логин: {user.login}</p>
                <p>Почта: {user.email}</p>
                <div className={styles.buttons}>
                  <input
                    type="file"
                    id="avatar-upload"
                    className={styles.avatarUpload}
                    onChange={handleAvatarChange}
                  />
                  <label htmlFor="avatar-upload">Загрузить аватар</label>
                </div>
              </div>
            </div>
          </div>
          <div className={main_styles.moduleSection}>
            <h2>Дополнительные данные</h2>
            <hr className={styles.prettyHr} />
            <div>
              <label>
                Имя:
                <input
                  maxLength={20}
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={styles.inputField}
                />
              </label>
              <label>
                Фамилия:
                <input
                  maxLength={20}
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className={styles.inputField}
                />
              </label>
              <button
                onClick={handleSave}
                className={main_styles.defaultButton}
              >
                Сохранить
              </button>
              <div
                className={`${styles.messageContainer} ${!messageVisible ? styles.hidden : ""}`}
              >
                {error && <p className={styles.errorMessage}>{error}</p>}
                {message && <p className={styles.successMessage}>{message}</p>}
              </div>
            </div>
          </div>
          <div className={main_styles.moduleSection}>
            <h2>Функции</h2>
            <hr className={styles.prettyHr} />
            <div className={styles.buttons}>
              <button
                onClick={handleDeleteAcc}
                className={main_styles.defaultButton}
              >
                Удалить аккаунт
              </button>
              <button
                onClick={() => setIsOpenChangeLoginModal(true)}
                className={main_styles.defaultButton}
              >
                Изменить логин
              </button>
              <button
                onClick={handleLogout}
                className={`${main_styles.defaultButton} ${main_styles.exitDeleteButton}`}
              >
                Выйти
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className={main_styles.spinner}>
          <ClipLoader size={50} color="#3498db" />
        </div>
      )}
      <div
        className={`${modal_styles.modal} ${isOpenChangeLoginModal ? modal_styles.activeModal : ""}`}
      >
        {isOpenChangeLoginModal && (
          <div className={modal_styles.modalContent}>
            <h3>
              <GoPencil className={main_styles.icon} />
              Введите новый логин
            </h3>
            <input
              maxLength={21}
              type="text"
              value={newLogin}
              onChange={(e) => setNewLogin(e.target.value)}
              placeholder="Новый логин..."
              className={styles.inputField}
            />
            <div
              className={`${styles.messageContainer} ${!messageLoginVisible ? styles.hidden : ""}`}
            >
              {errorLogin && (
                <p className={styles.errorMessage}>{errorLogin}</p>
              )}
              {messageLogin && (
                <p className={styles.successMessage}>{messageLogin}</p>
              )}
            </div>
            <div className={modal_styles.modalActions}>
              <DefaultBtn
                variant="confirmBtn"
                onClick={handleChangeLogin}
                icon={IoCheckmarkDoneOutline}
                className={btn_styles.roundCornersBtn}
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
    </div>
  );
};

export default Home;
