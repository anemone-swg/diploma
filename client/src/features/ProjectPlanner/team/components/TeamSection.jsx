import React from "react";
import TeamMembers from "@/features/ProjectPlanner/team/components/TeamMembers.jsx";
import team_section from "./TeamSection.module.css";
import SearchMembers from "@/features/ProjectPlanner/team/components/SearchMembers.jsx";

const TeamSection = ({ projectId }) => {
  return (
    <div className={team_section.teamPage}>
      <div className={team_section.teamPart}>
        <h2 className={team_section.teamPageTitle}>Команда проекта</h2>
        <TeamMembers />
      </div>
      <div className={team_section.searchPart}>
        <h2 className={team_section.teamPageTitle}>Приглашение участников</h2>
        <SearchMembers projectId={projectId} />
      </div>
    </div>
  );
};

export default TeamSection;
