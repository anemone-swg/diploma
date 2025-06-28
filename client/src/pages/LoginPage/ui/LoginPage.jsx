import React from "react";
import LoginPageSection from "@/widgets/LoginPageSection/ui/LoginPageSection.jsx";

const LoginPage = ({ onLogin }) => {
  return <LoginPageSection onLogin={onLogin} />;
};

export default LoginPage;
