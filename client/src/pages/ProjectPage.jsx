import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProjectById } from "@/services/ProjectPlannerTeamService.js";
import main_styles from "@/styles/App.module.css";
import { ClipLoader } from "react-spinners";
import ProjectPageSection from "@/features/ProjectPage/components/ProjectPageSection.jsx";

const ProjectPage = ({ sidebarWidth }) => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const getProject = async () => {
      try {
        const { project, currentUserId } = await fetchProjectById(projectId);
        setProject(project);
        setCurrentUserId(currentUserId);
        console.log(project);
      } catch (err) {
        console.error("Ошибка при загрузки проекта:", err);
      }
    };

    getProject();
  }, [projectId]);

  return (
    <div className={main_styles.page}>
      {project ? (
        <ProjectPageSection
          project={project}
          setProject={setProject}
          sidebarWidth={sidebarWidth}
          currentUserId={currentUserId}
        />
      ) : (
        <div className={main_styles.spinner}>
          <ClipLoader size={50} color="#3498db" />
        </div>
      )}
    </div>
  );
};

export default ProjectPage;
