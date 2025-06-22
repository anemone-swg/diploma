import React, { useEffect, useState } from "react";
import main_styles from "@/app/styles/App.module.css";
import team_members from "@/widgets/TeamSection/ui/ui/TeamMembers.module.css";
import search_members from "@/widgets/TeamSection/ui/ui/SearchMembers.module.css";
import defaultAvatar from "@/shared/assets/default_avatar.jpg";
import {
  deleteFromTeam,
  showTeam,
} from "@/services/ProjectPlannerTeamService.js";
import DefaultBtn from "@/shared/ui/DefaultBtn.jsx";
import btn_styles from "@/shared/ui/DefaultBtn.module.css";
import { MdCancel } from "react-icons/md";
import socket from "@/shared/lib/socket/socket.js";

const TeamMembers = ({ setBoards, projectId, refreshInvitations }) => {
  const [team, setTeam] = useState([]);

  useEffect(() => {
    showTeam(projectId).then(setTeam);

    const handleShowTeam = () => {
      showTeam(projectId).then(setTeam);
    };

    socket.on("inviteAccepted", handleShowTeam);
    socket.on("userDeletedFromTeam", handleShowTeam);

    return () => {
      socket.off("inviteAccepted", handleShowTeam);
      socket.off("userDeletedFromTeam", handleShowTeam);
    };
  }, [projectId]);

  const handleDeleteFromTeam = async (member) => {
    try {
      await deleteFromTeam(member.id_user, projectId);

      setTeam((prev) => prev.filter((user) => user.id_user !== member.id_user));

      setBoards((prevBoards) =>
        prevBoards.map((board) => ({
          ...board,
          teams: board.teams.map((team) => ({
            ...team,
            columns: team.columns.map((column) => ({
              ...column,
              tasks: column.tasks.map((task) => ({
                ...task,
                assignedUsers: task.assignedUsers?.filter(
                  (user) => user.id_user !== member.id_user,
                ),
              })),
            })),
          })),
        })),
      );
      if (refreshInvitations) {
        await refreshInvitations();
      }
    } catch (_) {
      /* empty */
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
