import { useState } from "react";
import styles from "./styles/App.module.css";
import KanbanBoardSection from "./features/kanban/components/KanbanBoardSection.jsx";
import TeamSection from "./features/team/components/TeamSection.jsx";
import ModalWindow, { ModalTypes } from "./components/shared/ModalWindow.jsx";
import NavBar from "./components/shared/NavBar.jsx";
import JoinSection from "./features/join/components/JoinSection.jsx";
import MainSection from "./features/main/components/MainSection.jsx";

function App() {
  const [boards, setBoards] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteTeamModal, setShowDeleteTeamModal] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState("");
  const [activeSection, setActiveSection] = useState("main");
  const [deletingTeam, setDeletingTeam] = useState(null);
  const [deletingColumn, setDeletingColumn] = useState(null);
  const [showDeleteColumnModal, setShowDeleteColumnModal] = useState(false);

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
          />
        );

      case "team":
        return <TeamSection />;

      case "join":
        return <JoinSection />;

      case "main":
        return <MainSection />;
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

export default App;
