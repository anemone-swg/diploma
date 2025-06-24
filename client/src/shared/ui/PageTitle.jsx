import React from "react";
import pageTitle_styles from "@/shared/ui/PageTitle.module.css";

const PageTitle = ({ className = "", title, icon: Icon }) => {
  return (
    <h1 className={className}>
      {Icon && <Icon className={pageTitle_styles.titleIcon} />}
      {title}
    </h1>
  );
};

export default PageTitle;
