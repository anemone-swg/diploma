import React, { useEffect, useState } from "react";
import main_styles from "@/styles/App.module.css";
import team_members from "./TeamMembers.module.css";
import search_members from "@/features/ProjectPlanner/team/components/SearchMembers.module.css";
import defaultAvatar from "@/assets/default_avatar.jpg";
import {
  deleteFromTeam,
  showTeam,
} from "@/services/ProjectPlannerTeamService.js";
import DefaultBtn from "@/components/ui/DefaultBtn.jsx";
import btn_styles from "@/components/ui/DefaultBtn.module.css";
import { MdCancel } from "react-icons/md";

const TeamMembers = ({ projectId, refreshInvitations }) => {
  const [team, setTeam] = useState([]);

  useEffect(() => {
    showTeam(projectId)
      .then(setTeam)
      .catch((err) => {
        console.error("Ошибка при загрузке команды:", err);
      });
  }, []);

  const handleDeleteFromTeam = async (member) => {
    try {
      await deleteFromTeam(member);
      setTeam((prev) => prev.filter((user) => user.id_user !== member.id_user));
      if (refreshInvitations) {
        await refreshInvitations(); // обновить приглашения
      }
    } catch (error) {
      console.error("Ошибка при удалении участника команды из нее:", error);
    }
  };

  return (
    <div
      className={`${main_styles.moduleSection} ${team_members.membersSection}`}
    >
      {team.length === 0 ? (
        <p>В команде никого нет.</p>
      ) : (
        team.map((member) => {
          return (
            <div key={member.id_user} className={team_members.memberOfTeam}>
              <img
                className={search_members.userAvatar}
                src={member.avatar || defaultAvatar}
                alt="Аватар"
              />
              <div>
                <p>
                  <strong>{member.login}</strong>
                </p>
                <p className={search_members.userNameInfo}>
                  {member.firstName} {member.lastName}
                </p>
              </div>
              <div>
                <DefaultBtn
                  className={btn_styles.roundCornersBtn}
                  icon={MdCancel}
                  disabled={false}
                  onClick={() => handleDeleteFromTeam(member)}
                />
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default TeamMembers;
