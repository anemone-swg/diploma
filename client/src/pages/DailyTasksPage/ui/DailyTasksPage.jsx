import React from "react";
import additional_styles from "@/shared/lib/classNames/Additional.module.css";
import DailyTasksSectionsWrapper from "@/widgets/DailyTasksSectionsWrapper/ui/DailyTasksSectionsWrapper.jsx";

const DailyTasksPage = () => {
  return (
    <div className={additional_styles.page}>
      <DailyTasksSectionsWrapper />
    </div>
  );
};

export default DailyTasksPage;
