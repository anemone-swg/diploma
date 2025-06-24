import React from "react";
import styles from "@/widgets/HomePageSection/ui/HomePageSection.module.css";
import main_styles from "@/app/styles/App.module.css";
import DefaultBtn from "@/shared/ui/DefaultBtn.jsx";
import DefaultInput from "@/shared/ui/DefaultInput.jsx";

const UserInfo = ({
  user,
  avatar,
  firstName,
  lastName,
  isDisabled,
  message,
  error,
  messageVisible,
  onFirstNameChange,
  onLastNameChange,
  onAvatarChange,
  onSaveUserInfo,
  onDeleteAcc,
  onLogout,
  onOpenChangeLoginModal,
}) => {
  if (!user) return null;

  return (
    <>
      {/* Основные данные */}
      <div className={main_styles.moduleSection}>
        <h2>Основные данные</h2>
        <hr className={main_styles.prettyHr} />
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
                onChange={onAvatarChange}
              />
              <label htmlFor="avatar-upload">Загрузить аватар</label>
            </div>
          </div>
        </div>
      </div>

      {/* Дополнительные данные */}
      <div className={main_styles.moduleSection}>
        <h2>Дополнительные данные</h2>
        <hr className={main_styles.prettyHr} />
        <div>
          <label>
            Имя:
            <DefaultInput value={firstName} onChange={onFirstNameChange} />
          </label>
          <label>
            Фамилия:
            <DefaultInput value={lastName} onChange={onLastNameChange} />
          </label>
          <DefaultBtn
            variant={"blueSectionBtn"}
            onClick={onSaveUserInfo}
            visibleDisabled={isDisabled}
          >
            Сохранить
          </DefaultBtn>
          <div
            className={`${styles.messageContainer} ${!messageVisible ? styles.hidden : ""}`}
          >
            {error && <p className={styles.errorMessage}>{error}</p>}
            {message && <p className={styles.successMessage}>{message}</p>}
          </div>
        </div>
      </div>

      {/* Функции */}
      <div className={main_styles.moduleSection}>
        <h2>Функции</h2>
        <hr className={main_styles.prettyHr} />
        <div className={styles.buttons}>
          <DefaultBtn onClick={onDeleteAcc} variant={"blueSectionBtn"}>
            Удалить аккаунт
          </DefaultBtn>
          <DefaultBtn
            onClick={onOpenChangeLoginModal}
            variant={"blueSectionBtn"}
          >
            Изменить логин
          </DefaultBtn>
          <DefaultBtn variant={"exitDeleteBtn"} onClick={onLogout}>
            Выйти
          </DefaultBtn>
        </div>
      </div>
    </>
  );
};

export default UserInfo;
