import { ProjectPlannerService } from "../services/projectPlanner.service.js";
import { io } from "../server.js";

class ProjectPlannerController {
  static async getProjects(req, res) {
    try {
      const projects = await ProjectPlannerService.getProjects(
        req.session.user.id,
      );
      res.json({ projects });
    } catch (error) {
      console.error("Ошибка получения всех проектов:", error);
      const status = error.statusCode || 500;
      res.status(status).json({ error: error.message || "Ошибка сервера" });
    }
  }

  static async addProject(req, res) {
    try {
      const { title } = req.body;
      const project = await ProjectPlannerService.addProject(
        title,
        req.session.user.id,
      );
      res.json({ project });
    } catch (error) {
      console.error("Ошибка создания проекта:", error);
      const status = error.statusCode || 500;
      res.status(status).json({ error: error.message || "Ошибка сервера" });
    }
  }

  static async renameProject(req, res) {
    try {
      const { projectId } = req.params;
      const { title } = req.body;
      const project = await ProjectPlannerService.renameProject(
        title,
        req.session.user.id,
        projectId,
      );
      io.emit("projectRenamed", project);
      res.sendStatus(204);
    } catch (error) {
      console.error("Ошибка переименования проекта:", error);
      const status = error.statusCode || 500;
      res.status(status).json({ error: error.message || "Ошибка сервера" });
    }
  }

  static async deleteProject(req, res) {
    try {
      await ProjectPlannerService.deleteProject(req.session.user.id);
      res.sendStatus(204);
    } catch (error) {
      console.error("Ошибка переименования проекта:", error);
      const status = error.statusCode || 500;
      res.status(status).json({ error: error.message || "Ошибка сервера" });
    }
  }

  static async addTeam(req, res) {
    try {
      const { title, id_project } = req.body;
      const team = await ProjectPlannerService.addTeam(title, id_project);
      io.emit("teamAdded");
      res.json({ team });
    } catch (error) {
      console.error("Ошибка создания команды проекта:", error);
      const status = error.statusCode || 500;
      res.status(status).json({ error: error.message || "Ошибка сервера" });
    }
  }

  static async renameTeam(req, res) {
    try {
      const { teamId } = req.params;
      const { title } = req.body;
      await ProjectPlannerService.renameTeam(teamId, title);
      io.emit("teamRenamed");
      res.sendStatus(204);
    } catch (error) {
      console.error("Ошибка при обновлении команды проекта:", error);
      const status = error.statusCode || 500;
      res.status(status).json({ error: error.message || "Ошибка сервера" });
    }
  }

  static async deleteTeam(req, res) {
    try {
      const { teamId } = req.params;
      await ProjectPlannerService.deleteTeam(teamId);
      io.emit("teamDeleted");
      res.sendStatus(204);
    } catch (error) {
      console.error("Ошибка при удалении команды проекта:", error);
      const status = error.statusCode || 500;
      res.status(status).json({ error: error.message || "Ошибка сервера" });
    }
  }

  static async addColumn(req, res) {
    try {
      const { title, id_team } = req.body;
      const column = await ProjectPlannerService.addColumn(id_team, title);
      io.emit("columnAdded");
      res.json({ column });
    } catch (error) {
      console.error("Ошибка при создании столбца команды:", error);
      const status = error.statusCode || 500;
      res.status(status).json({ error: error.message || "Ошибка сервера" });
    }
  }

  static async renameColumn(req, res) {
    try {
      const { columnId } = req.params;
      const { title } = req.body;
      await ProjectPlannerService.renameColumn(columnId, title);
      io.emit("columnRenamed");
      res.sendStatus(204);
    } catch (error) {
      console.error("Ошибка при переименовании столбца команды:", error);
      const status = error.statusCode || 500;
      res.status(status).json({ error: error.message || "Ошибка сервера" });
    }
  }

  static async deleteColumn(req, res) {
    try {
      const { columnId, teamId } = req.params;
      await ProjectPlannerService.deleteColumn(columnId, teamId);
      io.emit("columnDeleted");
      res.sendStatus(204);
    } catch (error) {
      console.error("Ошибка при удалении столбца команды:", error);
      const status = error.statusCode || 500;
      res.status(status).json({ error: error.message || "Ошибка сервера" });
    }
  }

  static async changeColorColumn(req, res) {
    try {
      const { columnId } = req.params;
      const { color } = req.body;
      await ProjectPlannerService.changeColorColumn(columnId, color);
      io.emit("columnChangedColor");
      res.sendStatus(204);
    } catch (error) {
      console.error("Ошибка при изменении цвета столбца команды:", error);
      const status = error.statusCode || 500;
      res.status(status).json({ error: error.message || "Ошибка сервера" });
    }
  }

  static async addTask(req, res) {
    try {
      const { content, id_column } = req.body;
      const task = await ProjectPlannerService.addTask(content, id_column);
      io.emit("taskAdded");
      res.json({ task });
    } catch (error) {
      console.error("Ошибка при создании задачи команды:", error);
      const status = error.statusCode || 500;
      res.status(status).json({ error: error.message || "Ошибка сервера" });
    }
  }

  static async deleteTask(req, res) {
    try {
      const { taskId } = req.params;
      await ProjectPlannerService.deleteTask(taskId);
      io.emit("taskDeleted");
      res.sendStatus(204);
    } catch (error) {
      console.error("Ошибка при удалении задачи команды:", error);
      const status = error.statusCode || 500;
      res.status(status).json({ error: error.message || "Ошибка сервера" });
    }
  }

  static async changeStatusTask(req, res) {
    try {
      const { taskId } = req.params;
      const task = await ProjectPlannerService.changeStatusTask(
        taskId,
        req.session.user.id,
      );
      io.emit("taskStatusChanged", task);
      res.sendStatus(204);
    } catch (error) {
      console.error("Ошибка при обновлении статуса задачи команды:", error);
      const status = error.statusCode || 500;
      res.status(status).json({ error: error.message || "Ошибка сервера" });
    }
  }

  static async changeContentTask(req, res) {
    try {
      const { taskId } = req.params;
      const { content } = req.body;
      await ProjectPlannerService.changeContentTask(taskId, content);
      io.emit("taskContentChanged");
      res.sendStatus(204);
    } catch (error) {
      console.error("Ошибка при обновлении контента задачи команды:", error);
      const status = error.statusCode || 500;
      res.status(status).json({ error: error.message || "Ошибка сервера" });
    }
  }

  static async changeDeadlineTask(req, res) {
    try {
      const { taskId } = req.params;
      const { deadline } = req.body;
      await ProjectPlannerService.changeDeadlineTask(taskId, deadline);
      io.emit("taskDeadlineChanged");
      res.sendStatus(204);
    } catch (error) {
      console.error("Ошибка при обновлении дедлайна задачи команды:", error);
      const status = error.statusCode || 500;
      res.status(status).json({ error: error.message || "Ошибка сервера" });
    }
  }

  static async moveTask(req, res) {
    try {
      const { taskId, newColumnId } = req.body;
      await ProjectPlannerService.moveTask(taskId, newColumnId);
      io.emit("taskMoved");
      res.sendStatus(204);
    } catch (error) {
      console.error("Ошибка при перемещении задачи команды:", error);
      const status = error.statusCode || 500;
      res.status(status).json({ error: error.message || "Ошибка сервера" });
    }
  }
}

export { ProjectPlannerController };
