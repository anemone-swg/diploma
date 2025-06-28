import React from "react";
import styles from "@/shared/lib/classNames/Additional.module.css";
import PageTitle from "@/shared/ui/PageTitle.jsx";
import { FaHome } from "react-icons/fa";
import HomePageSection from "@/widgets/HomePageSection/ui/HomePageSection.jsx";

const HomePage = ({ onLogout }) => {
  return (
    <div className={styles.page}>
      <PageTitle title={"Ваш аккаунт"} icon={FaHome} />
      <HomePageSection onLogout={onLogout} />
    </div>
  );
};

export default HomePage;
