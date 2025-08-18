import React, { useEffect, useState } from "react";
import Loader from "@/shared/ui/Loader.jsx";
import defaultAvatar from "@/shared/assets/default_avatar.jpg";
import { useNavigate } from "react-router-dom";
import ChangeLoginModal from "@/features/ChangeLoginModal/ui/ChangeLoginModal.jsx";
import UserInfo from "@/widgets/HomePageSection/ui/ui/UserInfo.jsx";
import { uploadAvatar } from "@/entities/User/api/uploadAvatar.js";
import { fetchUserData } from "@/entities/User/api/fetchUserData.js";
import { updateUserData } from "@/entities/User/api/updateUserData.js";
import { deleteUserAccount } from "@/entities/User/api/deleteUserAccount.js";
import { logoutUser } from "@/entities/User/api/logout.js";

const HomePageSection = ({ userData, onLogout }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [avatar, setAvatar] = useState(defaultAvatar);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [messageVisible, setMessageVisible] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const [isOpenChangeLoginModal, setIsOpenChangeLoginModal] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const handleUserInfoSubmit = async ({
    action,
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
    } catch (error) {
      if (setError) setError(error.message);
      if (setVisible) setVisible(true);

      setTimeout(() => {
        if (setVisible) setVisible(false);
        setTimeout(() => setError && setError(""), 500);
      }, 3000);
    }

    if (setDisabled) {
      setTimeout(() => {
        setDisabled(false);
      }, 5000);
    }
  };

  const handleUserInfoSave = () => {
    handleUserInfoSubmit({
      action: async () =>
        await updateUserData({ firstName, lastName }, userData.id_user),
      setMessage,
      setError,
      setVisible: setMessageVisible,
      setDisabled: setIsDisabled,
    });
  };

  const loadUserData = () => {
    fetchUserData(userData.id_user).then((data) => {
      setUser(data.user);
      setAvatar(data.user.avatar || defaultAvatar);
      setFirstName(data.user.firstName || "");
      setLastName(data.user.lastName || "");
    });
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
      localStorage.removeItem("token");
      navigate("/login");
    });
  };

  const handleDeleteAcc = () => {
    if (!window.confirm("Вы уверены, что хотите удалить аккаунт?")) {
      return;
    }

    deleteUserAccount(userData.id_user).then(() => {
      localStorage.removeItem("token");
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
            setIsOpen={setIsOpenChangeLoginModal}
            onSuccess={loadUserData}
          />
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default HomePageSection;
