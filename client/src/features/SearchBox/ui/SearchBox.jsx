import React, { useEffect, useState } from "react";
import search_styles from "@/features/SearchBox/ui/SearchBox.module.css";
import DefaultInput from "@/shared/ui/DefaultInput.jsx";
import styles from "@/shared/lib/classNames/Additional.module.css";
import { searchUsersByLogin } from "@/services/ProjectPlannerTeamService.js";
import { useDeleteUserByAdmin } from "@/entities/Admin/lib/hooks/useDeleteUserByAdmin.js";
import UserItem from "@/shared/ui/UserItem.jsx";

const SearchBox = ({ setUsers }) => {
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
      <p className={search_styles.helpText}>Введите ник пользователя:</p>
      <DefaultInput
        value={queryForAdmin}
        maxLength={50}
        onChange={(e) => setQueryForAdmin(e.target.value)}
        placeholder="Поиск по нику..."
      />
      <div className={`${styles.moduleSection} ${search_styles.searchSection}`}>
        {resultsForAdmin.length > 0 ? (
          resultsForAdmin
            .filter((user) => user.role !== "admin")
            .map((user) => (
              <UserItem
                key={user.id_user}
                user={user}
                onDelete={handleDeleteUserByAdmin}
              />
            ))
        ) : queryForAdmin.trim() !== "" ? (
          <p className={search_styles.noResults}>Ничего не найдено</p>
        ) : null}
      </div>
    </div>
  );
};

export default SearchBox;
