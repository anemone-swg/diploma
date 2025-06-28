import React, { useEffect, useState } from "react";
import search_styles from "@/features/SearchList/ui/SearchList.module.css";
import search_members from "@/widgets/TeamSection/ui/ui/SearchMembers.module.css";
import DefaultInput from "@/shared/ui/DefaultInput.jsx";
import styles from "@/shared/lib/classNames/Additional.module.css";
import defaultAvatar from "@/shared/assets/default_avatar.jpg";
import DefaultBtn from "@/shared/ui/DefaultBtn.jsx";
import { MdCancel } from "react-icons/md";
import { searchUsersByLogin } from "@/services/ProjectPlannerTeamService.js";
import { useDeleteUserByAdmin } from "@/entities/Admin/lib/hooks/useDeleteUserByAdmin.js";

const SearchList = ({ setUsers }) => {
  const [queryForAdmin, setQueryForAdmin] = useState("");
  const [resultsForAdmin, setResultsForAdmin] = useState([]);
  const deleteUserByAdmin = useDeleteUserByAdmin();

  useEffect(() => {
    if (queryForAdmin.trim() === "") {
      setResultsForAdmin([]);
      return;
    }

    const timeout = setTimeout(() => {
      searchUsersByLogin(queryForAdmin)
        .then(setResultsForAdmin)
        .catch(() => {
          setResultsForAdmin([]);
        });
    }, 300);

    return () => clearTimeout(timeout);
  }, [queryForAdmin]);

  const handleDeleteUserByAdmin = (user) => {
    deleteUserByAdmin(user, (deletedUser) => {
      setUsers((prev) => prev.filter((u) => u.id_user !== deletedUser.id_user));
    });
  };

  return (
    <div className={search_styles.searchList}>
      <p className={search_members.helpText}>Введите ник пользователя:</p>
      <DefaultInput
        value={queryForAdmin}
        maxLength={50}
        onChange={(e) => setQueryForAdmin(e.target.value)}
        placeholder="Поиск по нику..."
      />
      <div
        className={`${styles.moduleSection} ${search_members.searchSection}`}
      >
        {resultsForAdmin.length > 0 ? (
          resultsForAdmin
            .filter((user) => user.role !== "admin")
            .map((user) => {
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
                  <div className={search_styles.deleteBtn}>
                    <DefaultBtn
                      icon={MdCancel}
                      onClick={() => handleDeleteUserByAdmin(user)}
                    />
                  </div>
                </div>
              );
            })
        ) : queryForAdmin.trim() !== "" ? (
          <p className={search_members.noResults}>Ничего не найдено</p>
        ) : null}
      </div>
    </div>
  );
};

export default SearchList;
