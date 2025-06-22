import React, { useEffect, useRef, useState } from "react";
import selected_user_styles from "@/features/SelectedUser/ui/SelectedUser.module.css";
import {
  removeUserFromTask,
  selectUserForTask,
  showTeam,
} from "@/services/ProjectPlannerTeamService.js";
import team_members from "@/widgets/TeamSection/ui/ui/TeamMembers.module.css";
import search_members from "@/widgets/TeamSection/ui/ui/SearchMembers.module.css";
import defaultAvatar from "@/shared/assets/default_avatar.jpg";
import DefaultBtn from "@/shared/ui/DefaultBtn.jsx";
import btn_styles from "@/shared/ui/DefaultBtn.module.css";
import { ImCheckmark2 } from "react-icons/im";
import { IoMdClose } from "react-icons/io";

const SelectedUser = ({ task, projectId, setBoards }) => {
  const divRef = useRef(null);
  const buttonRef = useRef(null);
  const [showSelectedUserMenu, setShowSelectedUserMenu] = useState(false);
  const [team, setTeam] = useState([]);

  useEffect(() => {
    showTeam(projectId).then(setTeam);
  }, [projectId]);

  const handleClickOutside = (event) => {
    if (
      divRef.current &&
      !divRef.current.contains(event.target) &&
      buttonRef.current &&
      !buttonRef.current.contains(event.target)
    ) {
      setShowSelectedUserMenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleSelectUserForTask = async (member) => {
    try {
      const updatedUser = await selectUserForTask(member, task);

      setBoards((prevBoards) =>
        prevBoards.map((board) => ({
          ...board,
          teams: board.teams.map((team) => ({
            ...team,
            columns: team.columns.map((column) => ({
              ...column,
              tasks: column.tasks.map((t) => {
                if (t.id === task.id) {
                  return {
                    ...t,
                    assignedUsers: [...(t.assignedUsers || []), updatedUser],
                  };
                }
                return t;
              }),
            })),
          })),
        })),
      );
    } catch (_) {
      /* empty */
    }
  };

  const handleRemoveUserFromTask = (member) => {
    removeUserFromTask(member, task).then(() => {
      setBoards((prevBoards) =>
        prevBoards.map((board) => ({
          ...board,
          teams: board.teams.map((team) => ({
            ...team,
            columns: team.columns.map((column) => ({
              ...column,
              tasks: column.tasks.map((t) =>
                t.id === task.id
                  ? {
                      ...t,
                      assignedUsers: t.assignedUsers?.filter(
                        (u) => u.id_user !== member.id_user,
                      ),
                    }
                  : t,
              ),
            })),
          })),
        })),
      );
    });
  };

  return (
    <div
      ref={buttonRef}
      onClick={() => setShowSelectedUserMenu(!showSelectedUserMenu)}
      className={selected_user_styles.taskUser}
    >
      {task.assignedUsers && task.assignedUsers.length > 0 ? (
        <div>
          {task.assignedUsers.map((user) => (
            <div key={user.id_user} className={team_members.memberOfTeam}>
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
            </div>
          ))}
        </div>
      ) : (
        <p>Пользователи не назначены</p>
      )}

      {showSelectedUserMenu && (
        <div ref={divRef} className={selected_user_styles.userPicker}>
          {team.length === 0 ? (
            <p>В команде никого нет.</p>
          ) : (
            team.map((member) => {
              const isAssigned = task.assignedUsers?.some(
                (user) => user.id_user === member.id_user,
              );

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
                    {isAssigned ? (
                      <DefaultBtn
                        className={btn_styles.roundCornersBtn}
                        icon={IoMdClose}
                        onClick={() => handleRemoveUserFromTask(member)}
                      />
                    ) : (
                      <DefaultBtn
                        className={btn_styles.roundCornersBtn}
                        icon={ImCheckmark2}
                        onClick={() => handleSelectUserForTask(member)}
                      />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default SelectedUser;
