import React from "react";
import DefaultBtn from "../../../../components/ui/DefaultBtn.jsx";
import mainSection_styles from "./MainSection.module.css";
import btn_styles from "../../../../components/ui/DefaultBtn.module.css";

const MainSection = ({ boards, setActiveSection, setShowCreateModal }) => {
  return (
    <div className={mainSection_styles.mainBlock}>
      <div className={mainSection_styles.startBlock}>
        <h1>Добро пожаловать в раздел Kanban-доски 🧠</h1>
        <p>Ваш личный помощник в организации задач и управлении проектами</p>
        <ol className={mainSection_styles.steps}>
          <li>Создайте доску для своего проекта</li>
          <li>Добавьте участников и распределите роли</li>
          <li>Создавайте задачи, отслеживайте прогресс</li>
        </ol>
      </div>

      <div className={mainSection_styles.motivationBlock}>
        <h1>Управляй задачами легко и быстро 📋</h1>
        <p>
          Создавайте доски, управляйте командами и доводите проекты до идеала —
          всё в одном месте.
        </p>
        <div className={mainSection_styles.buttons}>
          <DefaultBtn
            onClick={() => {
              if (boards.length > 0) setActiveSection("kanban");
              else setShowCreateModal(true);
            }}
            className={`${btn_styles.roundCornersBtn} ${btn_styles.mainSectionBtn}`}
          >
            {boards.length === 0
              ? "🚀 Создать новую доску"
              : "🗂️ Открыть канбан-доску"}
          </DefaultBtn>
        </div>
      </div>
    </div>
  );
};

export default MainSection;
