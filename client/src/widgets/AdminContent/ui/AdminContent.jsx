import React, { useState } from "react";
import admin_styles from "@/widgets/AdminContent/ui/AdminContent.module.css";
import UserList from "@/features/UserList/ui/UserList.jsx";
import SearchList from "@/features/SearchList/ui/SearchList.jsx";

const AdminContent = () => {
  const [users, setUsers] = useState([]);

  return (
    <div className={admin_styles.adminContent}>
      <UserList users={users} setUsers={setUsers} />
      <SearchList setUsers={setUsers} />
    </div>
  );
};

export default AdminContent;
