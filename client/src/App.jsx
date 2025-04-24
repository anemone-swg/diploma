import React, { useState, useEffect } from "react";
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

function App() {
  const [sidebarWidth, setSidebarWidth] = useState(250);
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  // Проверка авторизации при монтировании компонента
  useEffect(() => {
    const checkUserAuth = async () => {
      try {
        const response = await checkAuth(); // Отправка запроса на сервер
        setIsAuthenticated(response.isAuthenticated); // Обновляем состояние авторизации
      } catch (error) {
        console.error("Ошибка при проверке авторизации:", error);
        setIsAuthenticated(false); // Если ошибка, считаем, что не авторизован
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
      <div className={main_styles.app}>
        {isAuthenticated && (
          <Sidebar onResize={(width) => setSidebarWidth(width)} />
        )}
        <div
          className={main_styles.content}
          style={{ marginLeft: `${isAuthenticated ? sidebarWidth : 0}px` }}
        >
          <Routes>
            {!isAuthenticated ? (
              <>
                <Route
                  path="/login"
                  element={<Login onLogin={() => setIsAuthenticated(true)} />}
                />
                <Route path="/register" element={<Registration />} />
                <Route path="*" element={<Navigate to="/login" />} />
              </>
            ) : (
              <>
                <Route
                  path="/home"
                  element={<Home onLogout={() => setIsAuthenticated(false)} />}
                />
                <Route path="/daily-tasks" element={<DailyTasks />} />
                <Route path="/project-planner" element={<ProjectPlanner />} />
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
