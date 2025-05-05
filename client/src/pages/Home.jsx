import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../services/AuthAndRegService";
import {
  deleteUserAccount,
  fetchUserData,
  updateUserData,
  uploadAvatar,
} from "../services/AccountService.js";
import main_styles from "../styles/App.module.css";
import styles from "../styles/Home.module.css";
import defaultAvatar from "../assets/default_avatar.jpg";
import { ClipLoader } from "react-spinners";
import { FaHome } from "react-icons/fa";

const Home = ({ onLogout }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [avatar, setAvatar] = useState(defaultAvatar);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [messageVisible, setMessageVisible] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      const data = await fetchUserData();
      if (data && data.user) {
        setUser(data.user);
        setAvatar(data.user.avatar || defaultAvatar);
        setFirstName(data.user.firstName || "");
        setLastName(data.user.lastName || "");
      }
    };

    loadUserData();
  }, []);

  const handleAvatarChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatar(imageUrl);

      try {
        await uploadAvatar(file);
        console.log("Аватар успешно загружен!");
      } catch (error) {
        console.error("Ошибка загрузки аватара:", error);
      }
    }
  };

  const handleSave = async () => {
    try {
      if (isDisabled) return;
      setIsDisabled(true);
      await updateUserData({ firstName, lastName });
      setError(""); // Если успешно, очищаем ошибку
      setMessage("Данные успешно сохранены!");
      setMessageVisible(true);
      setTimeout(() => {
        setMessageVisible(false);
        setTimeout(() => setMessage(""), 500);
      }, 3000);
    } catch (error) {
      console.error("Ошибка сохранения данных:", error);
      setMessageVisible(true);
      setTimeout(() => {
        setMessageVisible(false);
        setTimeout(() => setError(""), 500);
      }, 3000);
      setError(error.message);
    }
    setTimeout(() => {
      setIsDisabled(false); // Через 5 секунд снова активируем кнопку
    }, 5000);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      onLogout();
      navigate("/login");
    } catch (error) {
      console.error("Ошибка выхода:", error);
      alert("Не удалось выйти");
    }
  };

  const handleDeleteAcc = async () => {
    if (!window.confirm("Вы уверены, что хотите удалить аккаунт?")) {
      return;
    }

    try {
      await deleteUserAccount();
      alert("Аккаунт успешно удалён!");

      // Перенаправляем на страницу входа
      onLogout(); // Вызываем выход из аккаунта
      navigate("/login");
    } catch (error) {
      console.error("Ошибка удаления аккаунта:", error);
      alert(error.message);
    }
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
    </div>
  );
};

export default Home;
