import React, { useEffect, useState } from "react";
import Loader from "@/shared/ui/Loader.jsx";
import defaultAvatar from "@/shared/assets/default_avatar.jpg";
import {
  changeUserLogin,
  deleteUserAccount,
  fetchUserData,
  updateUserData,
  uploadAvatar,
} from "@/services/AccountService.js";
import { logoutUser } from "@/services/AuthAndRegService.js";
import { useNavigate } from "react-router-dom";
import modal_styles from "@/features/ModalWindow/ui/ModalWindow.module.css";
import ChangeLoginModal from "@/features/ChangeLoginModal/ui/ChangeLoginModal.jsx";
import UserInfo from "@/widgets/HomePageSection/ui/ui/UserInfo.jsx";

const HomePageSection = ({ onLogout }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [avatar, setAvatar] = useState(defaultAvatar);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [messageVisible, setMessageVisible] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [errorLogin, setErrorLogin] = useState("");
  const [messageLogin, setMessageLogin] = useState("");
  const [messageLoginVisible, setMessageLoginVisible] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isOpenChangeLoginModal, setIsOpenChangeLoginModal] = useState(false);
  const [newLogin, setNewLogin] = useState("");

  const handleUserInfoSubmit = async ({
    action,
    onSuccess = () => {},
    onError = () => {},
    setMessage,
    setError,
    setVisible,
    setDisabled,
  }) => {
    if (setDisabled) setDisabled(true);

    try {
      await action();
      if (setError) setError("");
      if (setMessage) setMessage("Данные успешно сохранены!");
      if (setVisible) setVisible(true);

      setTimeout(() => {
        if (setVisible) setVisible(false);
        setTimeout(() => setMessage && setMessage(""), 500);
      }, 3000);

      onSuccess();
    } catch (error) {
      if (setError) setError(error.message);
      if (setVisible) setVisible(true);

      setTimeout(() => {
        if (setVisible) setVisible(false);
        setTimeout(() => setError && setError(""), 500);
      }, 3000);

      onError(error);
    }

    if (setDisabled) {
      setTimeout(() => {
        setDisabled(false);
      }, 5000);
    }
  };

  const handleUserInfoSave = () => {
    handleUserInfoSubmit({
      action: async () => await updateUserData({ firstName, lastName }),
      setMessage,
      setError,
      setVisible: setMessageVisible,
      setDisabled: setIsDisabled,
    });
  };

  const handleUserLoginSave = () => {
    handleUserInfoSubmit({
      action: async () => {
        await changeUserLogin(newLogin);
        await loadUserData();
      },
      setMessage: setMessageLogin,
      setError: setErrorLogin,
      setVisible: setMessageLoginVisible,
      setDisabled: setIsDisabled,
    });
  };

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

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      uploadAvatar(file).then(() => setAvatar(imageUrl));
    }
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
    <>
      {user ? (
        <>
          <UserInfo
            user={user}
            avatar={avatar}
            firstName={firstName}
            lastName={lastName}
            isDisabled={isDisabled}
            message={message}
            error={error}
            messageVisible={messageVisible}
            onFirstNameChange={(e) => setFirstName(e.target.value)}
            onLastNameChange={(e) => setLastName(e.target.value)}
            onAvatarChange={handleAvatarChange}
            onSaveUserInfo={handleUserInfoSave}
            onDeleteAcc={handleDeleteAcc}
            onLogout={handleLogout}
            onOpenChangeLoginModal={() => setIsOpenChangeLoginModal(true)}
          />

          <ChangeLoginModal
            isOpen={isOpenChangeLoginModal}
            newLogin={newLogin}
            onChange={(e) => setNewLogin(e.target.value)}
            onClose={handleCloseChangeLoginModal}
            onSave={handleUserLoginSave}
            error={errorLogin}
            message={messageLogin}
            messageVisible={messageLoginVisible}
          />
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default HomePageSection;
