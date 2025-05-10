import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProjectById } from "@/services/ProjectPlannerTeamService.js";

const ProjectPage = ({ sidebarWidth }) => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    const getProject = async () => {
      try {
        const data = await fetchProjectById(projectId);
        setProject(data);
      } catch (err) {
        console.error("Ошибка при загрузки проекта:", err);
      }
    };

    getProject();
  }, [projectId]);

  if (!project) return <p>Загрузка проекта...</p>;

  return (
    <div>
      <h2>Проект: {project.title}</h2>
      {/* другие данные проекта */}
    </div>
  );
};

export default ProjectPage;
