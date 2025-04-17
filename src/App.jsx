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
  const [newBoardTitle, setNewBoardTitle] = useState("");
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [showColumnInput, setShowColumnInput] = useState(false);
  const [activeSection, setActiveSection] = useState("main");

  const renderContent = () => {
    switch (activeSection) {
      case "kanban":
        return (
          <KanbanBoardSection
            boards={boards}
            showColumnInput={showColumnInput}
            newColumnTitle={newColumnTitle}
            setShowColumnInput={setShowColumnInput}
            setNewColumnTitle={setNewColumnTitle}
            setBoards={setBoards}
            newBoardTitle={newBoardTitle}
            setNewBoardTitle={setNewBoardTitle}
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

      <div className={styles.contentContainer}>{renderContent()}</div>
    </div>
  );
}

export default App;
