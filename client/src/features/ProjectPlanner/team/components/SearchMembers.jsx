import React, { useEffect, useState } from "react";
import main_styles from "@/styles/App.module.css";
import search_members from "./SearchMembers.module.css";
import DefaultInput from "@/components/ui/DefaultInput.jsx";
import input_styles from "@/components/ui/DefaultInput.module.css";
import btn_styles from "@/components/ui/DefaultBtn.module.css";
import {
  cancelInvite,
  getSentInvites,
  handleInvite,
  searchUsersByLogin,
} from "@/services/ProjectPlannerTeamService.js";
import defaultAvatar from "@/assets/default_avatar.jpg";
import DefaultBtn from "@/components/ui/DefaultBtn.jsx";
import { FcInvite } from "react-icons/fc";
import { FaHourglassHalf } from "react-icons/fa";
import { MdCancel } from "react-icons/md";

const SearchMembers = ({ projectId }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [invitedIds, setInvitedIds] = useState([]);

  useEffect(() => {
    // Получаем список отправленных приглашений при загрузке
    getSentInvites()
      .then(setInvitedIds)
      .catch((err) => {
        console.error("Ошибка при загрузке отправленных приглашений:", err);
      });
  }, []);

  useEffect(() => {
    if (query.trim() === "") {
      setResults([]);
      return;
    }

    const timeout = setTimeout(() => {
      searchUsersByLogin(query)
        .then(setResults)
        .catch((err) => {
          console.error("Ошибка при поиске пользователей:", err);
          setResults([]);
        });
    }, 300); // debounce-пауза

    return () => clearTimeout(timeout);
  }, [query]);

  const handleInviteClick = async (toUserId) => {
    try {
      await handleInvite(toUserId, projectId);
      setInvitedIds((prev) => [...prev, toUserId]); // добавляем без запроса
    } catch (error) {
      console.error("Ошибка при отправке приглашения:", error);
    }
  };

  const handleCancelInvite = async (toUserId) => {
    try {
      await cancelInvite(toUserId);
      setInvitedIds((prev) => prev.filter((id) => id !== toUserId));
    } catch (err) {
      console.error("Ошибка при отмене приглашения:", err);
    }
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
            const isInvited = invitedIds.includes(user.id_user);
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
                {isInvited ? (
                  <div>
                    <FaHourglassHalf
                      className={`${main_styles.icon} ${search_members.invitedIcon}`}
                    />
                    <DefaultBtn
                      className={btn_styles.roundCornersBtn}
                      icon={MdCancel}
                      disabled={false}
                      onClick={() => handleCancelInvite(user.id_user)}
                    />
                  </div>
                ) : (
                  <DefaultBtn
                    className={btn_styles.roundCornersBtn}
                    icon={isInvited ? FaHourglassHalf : FcInvite}
                    onClick={() => handleInviteClick(user.id_user)}
                  />
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
