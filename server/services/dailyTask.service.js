import { DailyTask } from "../models/export.js";

class DailyTaskService {
  static async getTasks(userId) {
    return await DailyTask.findAll({
      where: { id_user: userId },
    });
  }

  static async addTask(title, due_date, description, userId) {
    return await DailyTask.create({
      id_user: userId,
      title,
      description: description || null,
      due_date: due_date || null,
      created_at: new Date(),
    });
  }

  static async toggleCompleteStatus(taskId) {
    const task = await DailyTask.findByPk(taskId);
    if (!task) {
      const error = new Error("Задача не найдена");
      error.statusCode = 404;
      throw error;
    }
    task.completed = !task.completed;
    await task.save();
  }

  static async changeDueDate(id_task, due_date) {
    const parsedDate = due_date ? new Date(due_date) : null;

    if (due_date && isNaN(parsedDate.getTime())) {
      const error = new Error("Некорректная дата");
      error.statusCode = 400;
      throw error;
    }

    await DailyTask.update(
      { due_date: parsedDate },
      { where: { id_task: id_task } },
    );
  }

  static async changeDescription(id_task, description) {
    if (description === "") description = null;

    const updated = await DailyTask.update(
      { description },
      { where: { id_task: id_task } },
    );

    if (updated[0] === 0) {
      const error = new Error("Задача не найдена");
      error.statusCode = 404;
      throw error;
    }
  }

  static async changeTitle(id_task, title) {
    if (title === "") title = null;

    const updated = await DailyTask.update(
      { title },
      { where: { id_task: id_task } },
    );

    if (updated[0] === 0) {
      const error = new Error("Задача не найдена");
      error.statusCode = 404;
      throw error;
    }
  }

  static async deleteTask(id_task, userId) {
    const deletedCount = await DailyTask.destroy({
      where: { id_task: id_task, id_user: userId },
    });

    if (deletedCount === 0) {
      const error = new Error("Задача не найдена");
      error.statusCode = 404;
      throw error;
    }
  }
}

export { DailyTaskService };
