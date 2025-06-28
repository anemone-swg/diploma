import React from "react";
import styles from "@/shared/lib/classNames/Additional.module.css";
import AdminNavbar from "@/widgets/AdminNavbar/ui/AdminNavbar.jsx";
import AdminContent from "@/widgets/AdminContent/ui/AdminContent.jsx";

const AdminPanelPage = ({ onLogout }) => {
  return (
    <div className={styles.page}>
      <AdminNavbar onLogout={onLogout} />
      <AdminContent />
    </div>
  );
};

export default AdminPanelPage;
