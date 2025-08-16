import React, { useEffect, useState } from "react";
import styles from "@/pages/ProjectPlannerPage/ui/ProjectPlannerPage.module.css";
import KanbanBoardSection from "@/widgets/KanbanBoardSection/ui/KanbanBoardSection.jsx";
import TeamSection from "@/widgets/TeamSection/ui/TeamSection.jsx";
import ModalWindow from "@/features/ModalWindow/ui/ModalWindow.jsx";
import { ModalTypes } from "@/shared/constants/modalTypes.js";
import NavBar from "@/widgets/Navbar/ui/NavBar.jsx";
import JoinSection from "@/widgets/JoinSection/ui/JoinSection.jsx";
import MainSection from "@/widgets/MainSection/ui/MainSection.jsx";
import { fetchProjects } from "../api/fetchProjects.js";
import socket from "@/shared/lib/socket/socket.js";
import TasksSection from "@/widgets/TasksSection/ui/TasksSection.jsx";

function ProjectPlannerPage({ sidebarWidth }) {
  const [boards, setBoards] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteTeamModal, setShowDeleteTeamModal] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState("");
  const [activeSection, setActiveSection] = useState("main");
  const [deletingTeam, setDeletingTeam] = useState(null);
  const [deletingColumn, setDeletingColumn] = useState(null);
  const [showDeleteColumnModal, setShowDeleteColumnModal] = useState(false);

  const normalizeProjects = (data) =>
    data.map((project) => ({
      ...project,
      id: project.id_project,
      teams:
        project.teams?.map((team) => ({
          ...team,
          id: team.id_team,
          columns:
            team.columns?.map((column) => ({
              ...column,
              id: column.id_column,
              tasks:
                column.tasks?.map((task) => ({
                  ...task,
                  id: task.id_task,
                })) || [],
            })) || [],
        })) || [],
    }));

  useEffect(() => {
    fetchProjects().then((data) => {
      setBoards(normalizeProjects(data));
    });
  }, []);

  useEffect(() => {
    const handleReloadProject = () => {
      fetchProjects().then((data) => {
        setBoards(normalizeProjects(data));
      });
    };

    socket.on("userDeleted", handleReloadProject);
    socket.on("userDeletedFromTeam", handleReloadProject);
    socket.on("taskStatusChanged", handleReloadProject);

    return () => {
      socket.off("userDeleted", handleReloadProject);
      socket.off("userDeletedFromTeam", handleReloadProject);
      socket.off("taskStatusChanged", handleReloadProject);
    };
  }, []);

  const renderContent = () => {
    switch (activeSection) {
      case "kanban":
        return (
          <KanbanBoardSection
            boards={boards}
            setBoards={setBoards}
            newBoardTitle={newBoardTitle}
            setNewBoardTitle={setNewBoardTitle}
            setShowDeleteTeamModal={setShowDeleteTeamModal}
            setDeletingTeam={setDeletingTeam}
            setDeletingColumn={setDeletingColumn}
            setShowDeleteColumnModal={setShowDeleteColumnModal}
            sidebarWidth={sidebarWidth}
          />
        );

      case "team":
        return <TeamSection projectId={boards[0].id} setBoards={setBoards} />;

      case "tasks":
        return <TasksSection boards={boards} />;

      case "join":
        return <JoinSection />;

      case "main":
        return (
          <MainSection
            boards={boards}
            setActiveSection={setActiveSection}
            setShowCreateModal={setShowCreateModal}
          />
        );
    }
  };

  return (
    <div>
      <NavBar
        activeSection={activeSection}
        boards={boards}
        setActiveSection={setActiveSection}
        setShowCreateModal={setShowCreateModal}
        setShowDeleteModal={setShowDeleteModal}
        sidebarWidth={sidebarWidth}
      />

      {/*Модальное окно для создания канбан-доски*/}
      <ModalWindow
        newBoardTitle={newBoardTitle}
        setNewBoardTitle={setNewBoardTitle}
        setShowModal={setShowCreateModal}
        showModal={showCreateModal}
        setBoards={setBoards}
        setActiveSection={setActiveSection}
        boards={boards}
        modalType={ModalTypes.CREATE}
      />

      {/*Модальное окно для удаления канбан-доски*/}
      <ModalWindow
        newBoardTitle={newBoardTitle}
        setNewBoardTitle={setNewBoardTitle}
        setShowModal={setShowDeleteModal}
        showModal={showDeleteModal}
        setBoards={setBoards}
        setActiveSection={setActiveSection}
        boards={boards}
        modalType={ModalTypes.DELETE}
      />

      {/*Модальное окно для удаления команды канбан-доски*/}
      <ModalWindow
        newBoardTitle={newBoardTitle}
        setNewBoardTitle={setNewBoardTitle}
        setShowModal={setShowDeleteTeamModal}
        showModal={showDeleteTeamModal}
        setBoards={setBoards}
        setActiveSection={setActiveSection}
        boards={boards}
        modalType={ModalTypes.DELETE_TEAM}
        setDeletingTeam={setDeletingTeam}
        deletingTeam={deletingTeam}
      />

      {/*Модальное окно для удаления столбца канбан-доски*/}
      <ModalWindow
        newBoardTitle={newBoardTitle}
        setNewBoardTitle={setNewBoardTitle}
        setShowModal={setShowDeleteColumnModal}
        showModal={showDeleteColumnModal}
        setBoards={setBoards}
        setActiveSection={setActiveSection}
        boards={boards}
        modalType={ModalTypes.DELETE_COLUMN}
        setDeletingColumn={setDeletingColumn}
        deletingColumn={deletingColumn}
      />

      <div className={styles.contentContainer}>{renderContent()}</div>
    </div>
  );
}

export default ProjectPlannerPage;
