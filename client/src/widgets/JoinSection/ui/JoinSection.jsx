import React, { useEffect, useState } from "react";
import main_styles from "@/app/styles/App.module.css";
import btn_styles from "@/shared/ui/DefaultBtn.module.css";
import team_section from "@/widgets/TeamSection/ui/TeamSection.module.css";
import join_section from "@/widgets/JoinSection/ui/JoinSection.module.css";
import {
  acceptInvite,
  declineInvite,
  deleteFromTeam,
  fetchCurrentUser,
  showInvitations,
} from "@/services/ProjectPlannerTeamService.js";
import search_members from "@/widgets/TeamSection/ui/ui/SearchMembers.module.css";
import defaultAvatar from "@/shared/assets/default_avatar.jpg";
import DefaultBtn from "@/shared/ui/DefaultBtn.jsx";
import { ImCheckmark2 } from "react-icons/im";
import { RxCross2 } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import socket from "@/shared/lib/socket/socket.js";

const JoinSection = () => {
  const [invitations, setInvitations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadInvitations = () => {
      showInvitations().then(setInvitations);
    };

    loadInvitations();

    socket.on("userDeletedFromTeam", loadInvitations);
    socket.on("inviteCanceled", loadInvitations);
    socket.on("userInvited", loadInvitations);

    return () => {
      socket.off("userDeletedFromTeam", loadInvitations);
      socket.off("inviteCanceled", loadInvitations);
      socket.off("userInvited", loadInvitations);
    };
  }, []);

  const handleAcceptInvite = (id_invite) => {
    acceptInvite(id_invite).then(() => {
      setInvitations((prev) =>
        prev.map((inv) =>
          inv.id_invite === id_invite ? { ...inv, status: "accepted" } : inv,
        ),
      );
    });
  };

  const handleDeclineInvite = (id_invite) => {
    declineInvite(id_invite).then(() => {
      setInvitations((prev) =>
        prev.map((inv) =>
          inv.id_invite === id_invite ? { ...inv, status: "declined" } : inv,
        ),
      );
    });
  };

  const handleOpenProject = (projectId) => {
    navigate(`/open_project/${projectId}`);
  };

  const handleExitProject = async (projectId, inviteId) => {
    try {
      const currentUserId = await fetchCurrentUser();
      deleteFromTeam(currentUserId, projectId).then(() => {
        setInvitations((prev) =>
          prev.filter((inv) => inv.id_invite !== inviteId),
        );
      });
    } catch (_) {
      /* empty */
    }
  };

  return (
    <div>
      <h2 className={team_section.teamPageTitle}>Ваши приглашения</h2>
      <div
        className={`${main_styles.moduleSection} ${join_section.joinSection}`}
      >
        {invitations.length === 0 ? (
          <p>Приглашения отсутствуют.</p>
        ) : (
          invitations.map((inv) => {
            const user = inv.fromUser;
            return (
              <div
                key={user.id_user}
                className={`${join_section.invitedUser} ${inv.status !== "pending" ? join_section.completedInvite : ""}`}
              >
                <img
                  className={search_members.userAvatar}
                  src={user.avatar || defaultAvatar}
                  alt="Аватар"
                />
                <div>
                  <p className={join_section.inviteMessage}>
                    Пользователь{" "}
                    <strong>
                      {user.login} ({user.firstName} {user.lastName})
                    </strong>{" "}
                    приглашает вас в проект: <strong>{inv.projectTitle}</strong>
                  </p>
                  {inv.status === "accepted" && (
                    <div className={join_section.btnGroup}>
                      <DefaultBtn
                        variant="confirmBtn"
                        className={btn_styles.openProjectBtn}
                        onClick={() => handleOpenProject(inv.id_project)}
                      >
                        Перейти к проекту
                      </DefaultBtn>
                      <DefaultBtn
                        variant="confirmBtn"
                        className={btn_styles.openProjectBtn}
                        onClick={() =>
                          handleExitProject(inv.id_project, inv.id_invite)
                        }
                      >
                        Выйти из проекта
                      </DefaultBtn>
                    </div>
                  )}
                </div>
                {inv.status === "pending" ? (
                  <div className={join_section.inviteBtn}>
                    <DefaultBtn
                      className={btn_styles.roundCornersBtn}
                      icon={ImCheckmark2}
                      onClick={() => handleAcceptInvite(inv.id_invite)}
                    >
                      <span>Принять</span>
                    </DefaultBtn>
                    <DefaultBtn
                      className={btn_styles.roundCornersBtn}
                      icon={RxCross2}
                      onClick={() => handleDeclineInvite(inv.id_invite)}
                    >
                      <span>Отклонить</span>
                    </DefaultBtn>
                  </div>
                ) : inv.status === "accepted" ? (
                  <div className={join_section.inviteStatus}>
                    <ImCheckmark2 />
                  </div>
                ) : (
                  <div className={join_section.inviteStatus}>
                    <RxCross2 />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default JoinSection;
