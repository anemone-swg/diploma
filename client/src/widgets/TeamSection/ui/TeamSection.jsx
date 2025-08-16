import React, { useEffect, useState } from "react";
import TeamMembers from "@/widgets/TeamSection/ui/ui/TeamMembers.jsx";
import team_section from "@/widgets/TeamSection/ui/TeamSection.module.css";
import SearchMembers from "@/widgets/TeamSection/ui/ui/SearchMembers.jsx";
import { getSentInvites } from "../api/getSentInvites.js";

const TeamSection = ({ projectId, setBoards }) => {
  const [invitations, setInvitations] = useState([]);

  const refreshInvitations = () => {
    getSentInvites().then((data) => {
      setInvitations(data);
    });
  };

  useEffect(() => {
    refreshInvitations();
  }, []);

  return (
    <div className={team_section.teamPage}>
      <div className={team_section.teamPart}>
        <h2 className={team_section.teamPageTitle}>Команда проекта</h2>
        <TeamMembers
          setBoards={setBoards}
          projectId={projectId}
          refreshInvitations={refreshInvitations}
        />
      </div>
      <div className={team_section.searchPart}>
        <h2 className={team_section.teamPageTitle}>Приглашение участников</h2>
        <SearchMembers
          projectId={projectId}
          invitations={invitations}
          refreshInvitations={refreshInvitations}
        />
      </div>
    </div>
  );
};

export default TeamSection;
