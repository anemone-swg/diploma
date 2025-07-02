import React from "react";
import defaultAvatar from "@/shared/assets/default_avatar.jpg";
import styles from "@/shared/ui/UserItem.module.css";
import DefaultBtn from "@/shared/ui/DefaultBtn.jsx";
import { MdCancel } from "react-icons/md";

const UserItem = ({ user, onDelete, BtnText = "" }) => {
  return (
    <div className={styles.userItem}>
      <img
        className={styles.userAvatar}
        src={user.avatar || defaultAvatar}
        alt="Аватар"
      />
      <div>
        <p>
          <strong>{user.login}</strong>
        </p>
        <p className={styles.userNameInfo}>
          {user.firstName} {user.lastName}
        </p>
      </div>
      <div className={styles.deleteBtn}>
        <DefaultBtn
          svgMargin={!!BtnText}
          icon={MdCancel}
          onClick={() => onDelete(user)}
        >
          {BtnText}
        </DefaultBtn>
      </div>
    </div>
  );
};

export default UserItem;
