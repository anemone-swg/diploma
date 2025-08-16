import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "@/shared/lib/classNames/Additional.module.css";
import ProjectPageSection from "@/widgets/ProjectPageSection/ui/ProjectPageSection.jsx";
import socket from "@/shared/lib/socket/socket.js";
import { toast } from "react-toastify";
import Loader from "@/shared/ui/Loader.jsx";
import { fetchProjectById } from "../api/fetchProjectById.js";

const ProjectPage = ({ sidebarWidth }) => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const navigate = useNavigate();
  const wasKicked = useRef(false);

  useEffect(() => {
    const getProject = () => {
      fetchProjectById(projectId).then(({ project, currentUserId }) => {
        setProject(project);
        setCurrentUserId(currentUserId);
        console.log(project);
      });
    };

    getProject();
  }, [projectId]);

  useEffect(() => {
    const handleProjectRenamed = (updatedProject) => {
      setProject((prevProject) =>
        prevProject?.id_project === updatedProject.id_project
          ? { ...prevProject, title: updatedProject.title }
          : prevProject,
      );
    };

    const handleReloadProject = () => {
      fetchProjectById(projectId).then(({ project }) => {
        setProject(project);
      });
    };

    const handleUserDeletedFromTeam = () => {
      if (!wasKicked.current) {
        wasKicked.current = true;
        toast.error("Вы вышли из проекта/были удалены.");
        navigate("/project-planner");
      }
    };

    socket.on("userDeleted", handleReloadProject);
    socket.on("userDeletedFromTeam", handleUserDeletedFromTeam);
    socket.on("userUnassignedToTask", handleReloadProject);
    socket.on("userAssignedToTask", handleReloadProject);
    socket.on("taskMoved", handleReloadProject);
    socket.on("taskDeadlineChanged", handleReloadProject);
    socket.on("taskContentChanged", handleReloadProject);
    socket.on("taskDeleted", handleReloadProject);
    socket.on("taskAdded", handleReloadProject);
    socket.on("columnChangedColor", handleReloadProject);
    socket.on("columnDeleted", handleReloadProject);
    socket.on("columnRenamed", handleReloadProject);
    socket.on("columnAdded", handleReloadProject);
    socket.on("teamDeleted", handleReloadProject);
    socket.on("teamRenamed", handleReloadProject);
    socket.on("teamAdded", handleReloadProject);
    socket.on("taskStatusChanged", handleReloadProject);
    socket.on("projectRenamed", handleProjectRenamed);

    return () => {
      socket.off("userDeleted", handleReloadProject);
      socket.off("userDeletedFromTeam", handleUserDeletedFromTeam);
      socket.off("userUnassignedToTask", handleReloadProject);
      socket.off("userAssignedToTask", handleReloadProject);
      socket.off("taskMoved", handleReloadProject);
      socket.off("taskDeadlineChanged", handleReloadProject);
      socket.off("taskContentChanged", handleReloadProject);
      socket.off("taskDeleted", handleReloadProject);
      socket.off("taskAdded", handleReloadProject);
      socket.off("columnChangedColor", handleReloadProject);
      socket.off("columnDeleted", handleReloadProject);
      socket.off("columnRenamed", handleReloadProject);
      socket.off("columnAdded", handleReloadProject);
      socket.off("teamDeleted", handleReloadProject);
      socket.off("teamRenamed", handleReloadProject);
      socket.off("teamAdded", handleReloadProject);
      socket.off("taskStatusChanged", handleReloadProject);
      socket.off("projectRenamed", handleProjectRenamed);
    };
  }, [navigate, projectId]);

  return (
    <div className={styles.page}>
      {project ? (
        <ProjectPageSection
          project={project}
          sidebarWidth={sidebarWidth}
          currentUserId={currentUserId}
        />
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default ProjectPage;
