import React, { useEffect, useState } from "react";
import main_styles from "@/styles/App.module.css";
import search_members from "./SearchMembers.module.css";
import DefaultInput from "@/components/ui/DefaultInput.jsx";
import input_styles from "@/components/ui/DefaultInput.module.css";
import btn_styles from "@/components/ui/DefaultBtn.module.css";
import {
  cancelInvite,
  searchUsersByLogin,
  sendInvite,
} from "@/services/ProjectPlannerTeamService.js";
import defaultAvatar from "@/assets/default_avatar.jpg";
import DefaultBtn from "@/components/ui/DefaultBtn.jsx";
import { FcInvite } from "react-icons/fc";
import { FaHourglassHalf } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { ImCheckmark2 } from "react-icons/im";
import socket from "@/services/socket.js";

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
    <div>
      <p className={search_members.helpText}>Введите ник пользователя:</p>
      <DefaultInput
        value={query}
        maxLength={50}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Поиск по нику..."
        className={`${input_styles.defaultInput} ${input_styles.searchMembersInput}`}
      />
      <div
        className={`${main_styles.moduleSection} ${search_members.searchSection}`}
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
                      className={`${main_styles.icon} ${search_members.invitedIcon}`}
                    />
                    <DefaultBtn
                      className={btn_styles.roundCornersBtn}
                      icon={MdCancel}
                      disabled={false}
                      onClick={() => handleCancelInvite(user)}
                    />
                  </div>
                ) : !isInvited ? (
                  <DefaultBtn
                    className={btn_styles.roundCornersBtn}
                    icon={isInvited ? FaHourglassHalf : FcInvite}
                    onClick={() => handleInviteClick(user)}
                  />
                ) : isInvited && invited.status === "accepted" ? (
                  <ImCheckmark2
                    className={`${main_styles.icon} ${search_members.invitedIcon}`}
                  />
                ) : (
                  <div className={search_members.declinedItem}>
                    <span className={search_members.declinedMessage}>
                      Отменил ваше приглашение
                    </span>
                    <DefaultBtn
                      className={btn_styles.roundCornersBtn}
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
    </div>
  );
};

export default SearchMembers;
