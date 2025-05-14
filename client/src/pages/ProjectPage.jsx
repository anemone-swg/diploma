import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchProjectById } from "@/services/ProjectPlannerTeamService.js";
import main_styles from "@/styles/App.module.css";
import { ClipLoader } from "react-spinners";
import ProjectPageSection from "@/features/ProjectPage/components/ProjectPageSection.jsx";
import socket from "@/services/socket.js";
import { toast } from "react-toastify";

const ProjectPage = ({ sidebarWidth }) => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const navigate = useNavigate();
  const wasKicked = useRef(false);

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

  useEffect(() => {
    const handleTaskStatusChanged = (updatedTask) => {
      setProject((prevProject) => ({
        ...prevProject,
        teams: prevProject.teams.map((team) => ({
          ...team,
          columns: team.columns.map((column) => ({
            ...column,
            tasks: column.tasks.map((task) =>
              task.id_task === updatedTask.id_task
                ? { ...task, completed: !task.completed }
                : task,
            ),
          })),
        })),
      }));
    };

    const handleProjectRenamed = (updatedProject) => {
      setProject((prevProject) =>
        prevProject?.id_project === updatedProject.id_project
          ? { ...prevProject, title: updatedProject.title }
          : prevProject,
      );
    };

    const handleReloadProject = async () => {
      try {
        const { project } = await fetchProjectById(projectId);
        setProject(project);
      } catch (err) {
        console.error("Ошибка при обновлении проекта:", err);
      }
    };

    const handleUserDeletedFromTeam = () => {
      if (!wasKicked.current) {
        wasKicked.current = true;
        toast.error("Вы вышли из проекта/были удалены.");
        navigate("/project-planner");
      }
    };

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
    socket.on("taskStatusChanged", handleTaskStatusChanged);
    socket.on("projectRenamed", handleProjectRenamed);

    return () => {
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
      socket.off("taskStatusChanged", handleTaskStatusChanged);
      socket.off("projectRenamed", handleProjectRenamed);
    };
  }, []);

  return (
    <div className={main_styles.page}>
      {project ? (
        <ProjectPageSection
          project={project}
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
