import React from "react";
import main_styles from "@/app/styles/App.module.css";
import PageTitle from "@/shared/ui/PageTitle.jsx";
import { FaHome } from "react-icons/fa";
import HomePageSection from "@/widgets/HomePageSection/ui/HomePageSection.jsx";

const HomePage = ({ onLogout }) => {
  return (
    <div className={main_styles.page}>
      <PageTitle title={"Ваш аккаунт"} icon={FaHome} />
      <HomePageSection onLogout={onLogout} />
    </div>
  );
};

export default HomePage;
