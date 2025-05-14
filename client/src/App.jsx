import React, { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home.jsx";
import DailyTasks from "./pages/DailyTasks.jsx";
import ProjectPlanner from "./pages/ProjectPlanner.jsx";
import Sidebar from "./components/shared/Sidebar.jsx";
import Login from "./pages/Login.jsx";
import Registration from "./pages/Registration.jsx";
import { checkAuth } from "./services/AuthAndRegService.js";
import { ClipLoader } from "react-spinners";
import main_styles from "./styles/App.module.css";
import ProjectPage from "@/pages/ProjectPage.jsx";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import AdminPanel from "@/pages/AdminPanel.jsx";

function App() {
  const [sidebarWidth, setSidebarWidth] = useState(200);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [userRole, setUserRole] = useState(null);

  // Проверка авторизации при монтировании компонента
  useEffect(() => {
    const checkUserAuth = async () => {
      try {
        const response = await checkAuth(); // Отправка запроса на сервер
        setIsAuthenticated(response.isAuthenticated); // Обновляем состояние авторизации
        setUserRole(response.role);
      } catch (error) {
        console.error("Ошибка при проверке авторизации:", error);
        setIsAuthenticated(false); // Если ошибка, считаем, что не авторизован
        setUserRole(null);
      }
    };

    checkUserAuth(); // Проверка авторизации при монтировании компонента
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className={main_styles.spinner}>
        <ClipLoader size={50} color="#3498db" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div
        className={main_styles.app}
        style={{
          paddingLeft:
            isAuthenticated && userRole !== "admin" ? `${sidebarWidth}px` : 0,
        }}
      >
        <ToastContainer position="top-right" autoClose={3000} theme="dark" />
        {isAuthenticated && userRole !== "admin" && (
          <Sidebar
            onResize={(width) => setSidebarWidth(width)}
            sidebarWidth={sidebarWidth}
            setSidebarWidth={setSidebarWidth}
          />
        )}
        <div className={main_styles.content}>
          <Routes>
            {!isAuthenticated ? (
              <>
                <Route
                  path="/login"
                  element={
                    <Login
                      onLogin={(role) => {
                        setIsAuthenticated(true);
                        setUserRole(role);
                      }}
                    />
                  }
                />
                <Route path="/register" element={<Registration />} />
                <Route path="*" element={<Navigate to="/login" />} />
              </>
            ) : userRole === "admin" ? (
              <>
                <Route
                  path="/admin"
                  element={
                    <div>
                      <AdminPanel
                        onLogout={() => {
                          setIsAuthenticated(false);
                          setUserRole(null);
                        }}
                      />
                    </div>
                  }
                />
                <Route path="*" element={<Navigate to="/admin" />} />
              </>
            ) : (
              <>
                <Route
                  path="/home"
                  element={
                    <Home
                      onLogout={() => {
                        setIsAuthenticated(false);
                        setUserRole(null);
                      }}
                    />
                  }
                />
                <Route path="/daily-tasks" element={<DailyTasks />} />
                <Route
                  path="/project-planner"
                  element={<ProjectPlanner sidebarWidth={sidebarWidth} />}
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
    </BrowserRouter>
  );
}

export default App;
