import { DailyTaskService } from "../services/dailyTask.service.js";

class DailyTaskController {
  static async getTasks(req, res) {
    try {
      const tasks = await DailyTaskService.getTasks(req.session.user.id);
      res.json({ tasks });
    } catch (error) {
      console.error("Ошибка получения списка задач:", error);
      const status = error.statusCode || 500;
      res.status(status).json({ error: error.message || "Ошибка сервера" });
    }
  }

  static async addTask(req, res) {
    try {
      const { title, due_date, description } = req.body;
      const userId = req.session.user.id;

      const task = await DailyTaskService.addTask(
        title,
        due_date,
        description,
        userId,
      );

      res.json({ task });
    } catch (error) {
      console.error("Ошибка создания задачи:", error);
      const status = error.statusCode || 500;
      res.status(status).json({ error: error.message || "Ошибка сервера" });
    }
  }

  static async toggleCompleteStatus(req, res) {
    try {
      await DailyTaskService.toggleCompleteStatus(req.params.id_task);
      res.sendStatus(204);
    } catch (error) {
      console.error("Ошибка изменения статуса задачи задачи:", error);
      const status = error.statusCode || 500;
      res.status(status).json({ error: error.message || "Ошибка сервера" });
    }
  }

  static async changeDueDate(req, res) {
    try {
      const { id_task } = req.params;
      const { due_date } = req.body;

      await DailyTaskService.changeDueDate(id_task, due_date);

      res.sendStatus(204);
    } catch (error) {
      console.error("Ошибка изменения даты выполнения задачи:", error);
      const status = error.statusCode || 500;
      res.status(status).json({ error: error.message || "Ошибка сервера" });
    }
  }

  static async changeDescription(req, res) {
    try {
      const { id_task } = req.params;
      const { description } = req.body;

      await DailyTaskService.changeDescription(id_task, description);

      res.sendStatus(204);
    } catch (error) {
      console.error("Ошибка при обновлении описания задачи:", error);
      const status = error.statusCode || 500;
      res.status(status).json({ error: error.message || "Ошибка сервера" });
    }
  }

  static async changeTitle(req, res) {
    try {
      const { id_task } = req.params;
      const { title } = req.body;
      await DailyTaskService.changeTitle(id_task, title);
      res.sendStatus(204);
    } catch (error) {
      console.error("Ошибка при обновлении названия задачи:", error);
      const status = error.statusCode || 500;
      res.status(status).json({ error: error.message || "Ошибка сервера" });
    }
  }

  static async deleteTask(req, res) {
    try {
      const { id_task } = req.params;
      await DailyTaskService.deleteTask(id_task, req.session.user.id);
      res.sendStatus(204);
    } catch (error) {
      console.error("Ошибка при удалении задачи:", error);
      const status = error.statusCode || 500;
      res.status(status).json({ error: error.message || "Ошибка сервера" });
    }
  }
}

export { DailyTaskController };
