import React, { useEffect, useState } from "react";
import main_styles from "@/styles/App.module.css";
import btn_styles from "@/components/ui/DefaultBtn.module.css";
import team_section from "@/features/ProjectPlanner/team/components/TeamSection.module.css";
import join_section from "@/features/ProjectPlanner/join/components/JoinSection.module.css";
import {
  acceptInvite,
  declineInvite,
  showInvitations,
} from "@/services/ProjectPlannerTeamService.js";
import search_members from "@/features/ProjectPlanner/team/components/SearchMembers.module.css";
import defaultAvatar from "@/assets/default_avatar.jpg";
import DefaultBtn from "@/components/ui/DefaultBtn.jsx";
import { ImCheckmark2 } from "react-icons/im";
import { RxCross2 } from "react-icons/rx";

const JoinSection = () => {
  const [invitations, setInvitations] = useState([]);

  useEffect(() => {
    showInvitations()
      .then(setInvitations)
      .catch((err) => {
        console.error("Ошибка при загрузке приглашений:", err);
      });
  }, []);

  const handleAcceptInvite = async (id_invite) => {
    try {
      await acceptInvite(id_invite);

      setInvitations((prev) =>
        prev.map((inv) =>
          inv.id_invite === id_invite ? { ...inv, status: "accepted" } : inv,
        ),
      );
    } catch (error) {
      console.error("Ошибка при принятии приглашения:", error);
    }
  };

  const handleDeclineInvite = async (id_invite) => {
    try {
      await declineInvite(id_invite);

      setInvitations((prev) =>
        prev.map((inv) =>
          inv.id_invite === id_invite ? { ...inv, status: "declined" } : inv,
        ),
      );
    } catch (error) {
      console.error("Ошибка при отклонении приглашения:", error);
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
                  <p>
                    Пользователь <strong>{user.login}</strong> приглашает вас в
                    проект: <strong>{inv.projectTitle}</strong>
                  </p>
                  <p className={search_members.userNameInfo}>
                    {user.firstName} {user.lastName}
                  </p>
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
