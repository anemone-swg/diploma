import React, { useState } from "react";
import admin_styles from "@/widgets/AdminContent/ui/AdminContent.module.css";
import UserList from "@/features/UserList/ui/UserList.jsx";
import SearchBox from "@/features/SearchBox/ui/SearchBox.jsx";

const AdminContent = () => {
  const [users, setUsers] = useState([]);

  return (
    <div className={admin_styles.adminContent}>
      <UserList users={users} setUsers={setUsers} />
      <SearchBox setUsers={setUsers} />
    </div>
  );
};

export default AdminContent;
