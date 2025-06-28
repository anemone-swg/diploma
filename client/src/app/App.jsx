import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import HomePage from "@/pages/HomePage/ui/HomePage.jsx";
import DailyTasksPage from "@/pages/DailyTasksPage/ui/DailyTasksPage.jsx";
import ProjectPlannerPage from "@/pages/ProjectPlannerPage/ui/ProjectPlannerPage.jsx";
import Sidebar from "@/widgets/Sidebar/ui/Sidebar.jsx";
import LoginPage from "@/pages/LoginPage/ui/LoginPage.jsx";
import RegistrationPage from "@/pages/RegistrationPage/ui/RegistrationPage.jsx";
import main_styles from "@/app/styles/App.module.css";
import ProjectPage from "@/pages/ProjectPage/ui/ProjectPage.jsx";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import AdminPanelPage from "@/pages/AdminPanelPage/ui/AdminPanelPage.jsx";
import Loader from "@/shared/ui/Loader.jsx";
import { checkAuth } from "@/app/api/checkAuth.js";

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

function AppContent() {
  const [sidebarWidth, setSidebarWidth] = useState(200);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const location = useLocation();
  const isAdminPage = location.pathname === "/admin";

  useEffect(() => {
    const checkUserAuth = () => {
      checkAuth()
        .then((response) => {
          setIsAuthenticated(response.isAuthenticated);
          setUserRole(response.role);
        })
        .catch(() => {
          setIsAuthenticated(false);
          setUserRole(null);
        });
    };

    checkUserAuth();
  }, []);

  if (isAuthenticated === null) {
    return <Loader />;
  }

  return (
    <div
      className={main_styles.app}
      style={{
        paddingLeft: isAuthenticated && !isAdminPage ? `${sidebarWidth}px` : 0,
      }}
    >
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
      {isAuthenticated && !isAdminPage && (
        <Sidebar
          onResize={(width) => setSidebarWidth(width)}
          sidebarWidth={sidebarWidth}
          setSidebarWidth={setSidebarWidth}
          userRole={userRole}
        />
      )}
      <div className={main_styles.content}>
        <Routes>
          {!isAuthenticated ? (
            <>
              <Route
                path="/login"
                element={
                  <LoginPage
                    onLogin={(role) => {
                      setIsAuthenticated(true);
                      setUserRole(role);
                    }}
                  />
                }
              />
              <Route path="/register" element={<RegistrationPage />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </>
          ) : (
            <>
              {userRole === "admin" && (
                <Route
                  path="/admin"
                  element={
                    <AdminPanelPage
                      onLogout={() => {
                        setIsAuthenticated(false);
                        setUserRole(null);
                      }}
                    />
                  }
                />
              )}
              <Route
                path="/home"
                element={
                  <HomePage
                    onLogout={() => {
                      setIsAuthenticated(false);
                      setUserRole(null);
                    }}
                  />
                }
              />
              <Route path="/daily-tasks" element={<DailyTasksPage />} />
              <Route
                path="/project-planner"
                element={<ProjectPlannerPage sidebarWidth={sidebarWidth} />}
              />
              <Route
                path="/open_project/:projectId"
                element={<ProjectPage sidebarWidth={sidebarWidth} />}
              />
              <Route path="*" element={<Navigate to="/home" />} />
            </>
          )}
        </Routes>
      </div>
    </div>
  );
}

export default App;
