import React, { useEffect, useState } from "react";
import styles from "@/shared/lib/classNames/Additional.module.css";
import search_members from "@/widgets/TeamSection/ui/ui/SearchMembers.module.css";
import DefaultInput from "@/shared/ui/DefaultInput.jsx";
import defaultAvatar from "@/shared/assets/default_avatar.jpg";
import DefaultBtn from "@/shared/ui/DefaultBtn.jsx";
import { FcInvite } from "react-icons/fc";
import { FaHourglassHalf } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { ImCheckmark2 } from "react-icons/im";
import socket from "@/shared/lib/socket/socket.js";
import { searchUsersByLogin } from "@/entities/User/api/searchUsersByLogin.js";
import { sendInvite } from "../../api/sendInvite.js";
import { cancelInvite } from "../../api/cancelInvite.js";

const SearchMembers = ({ projectId, invitations, refreshInvitations }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (query.trim() === "") {
      setResults([]);
      return;
    }

    const timeout = setTimeout(() => {
      searchUsersByLogin(query)
        .then(setResults)
        .catch(() => {
          setResults([]);
        });
    }, 300); // debounce-пауза

    return () => clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    const handleInviteChanged = () => {
      if (query.trim() !== "") {
        searchUsersByLogin(query)
          .then(setResults)
          .catch(() => {
            setResults([]);
          });
      }

      refreshInvitations();
    };

    socket.on("userDeletedFromTeam", handleInviteChanged);
    socket.on("inviteDeclined", handleInviteChanged);
    socket.on("inviteAccepted", handleInviteChanged);

    return () => {
      socket.off("inviteDeclined", handleInviteChanged);
      socket.off("inviteAccepted", handleInviteChanged);
    };
  }, [query, refreshInvitations]);

  const handleInviteClick = (user) => {
    sendInvite(user.id_user, projectId).then(() => {
      refreshInvitations();
    });
  };

  const handleCancelInvite = (user) => {
    cancelInvite(user.id_user).then(() => {
      refreshInvitations();
    });
  };

  return (
    <>
      <p className={search_members.helpText}>Введите ник пользователя:</p>
      <DefaultInput
        value={query}
        maxLength={50}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Поиск по нику..."
      />
      <div
        className={`${styles.moduleSection} ${search_members.searchSection}`}
      >
        {results.length > 0 ? (
          results.map((user) => {
            const invited = invitations.find(
              (inv) => inv.toUserId === user.id_user,
            );
            const isInvited = Boolean(invited);
            return (
              <div key={user.login} className={search_members.resultItem}>
                <img
                  className={search_members.userAvatar}
                  src={user.avatar || defaultAvatar}
                  alt="Аватар"
                />
                <div>
                  <p>
                    <strong>{user.login}</strong>
                  </p>
                  <p className={search_members.userNameInfo}>
                    {user.firstName} {user.lastName}
                  </p>
                </div>
                {isInvited && invited.status === "pending" ? (
                  <div>
                    <FaHourglassHalf
                      className={`${styles.icon} ${search_members.invitedIcon}`}
                    />
                    <DefaultBtn
                      icon={MdCancel}
                      disabled={false}
                      onClick={() => handleCancelInvite(user)}
                    />
                  </div>
                ) : !isInvited ? (
                  <DefaultBtn
                    icon={isInvited ? FaHourglassHalf : FcInvite}
                    onClick={() => handleInviteClick(user)}
                  />
                ) : isInvited && invited.status === "accepted" ? (
                  <ImCheckmark2
                    className={`${styles.icon} ${search_members.invitedIcon}`}
                  />
                ) : (
                  <div className={search_members.declinedItem}>
                    <span className={search_members.declinedMessage}>
                      Отменил ваше приглашение
                    </span>
                    <DefaultBtn
                      icon={FcInvite}
                      onClick={() => handleInviteClick(user)}
                    />
                  </div>
                )}
              </div>
            );
          })
        ) : query.trim() !== "" ? (
          <p className={search_members.noResults}>Ничего не найдено</p>
        ) : null}
      </div>
    </>
  );
};

export default SearchMembers;
