import {
  Column,
  Project,
  Task,
  Team,
  TeamOfProject,
  User,
} from "../models/export.js";

const AVATAR_PATH = process.env.AVATAR_PATH;

class ProjectPlannerService {
  static async getProjects(userId) {
    const projects = await Project.findAll({
      where: { id_user: userId },
      include: [
        {
          model: Team,
          as: "teams",
          include: [
            {
              model: Column,
              as: "columns",
              separate: true,
              order: [["order", "ASC"]],
              include: [
                {
                  model: Task,
                  as: "tasks",
                  separate: true,
                  order: [["createdAt", "ASC"]],
                  include: [
                    {
                      model: User,
                      as: "assignedUsers",
                      attributes: [
                        "id_user",
                        "login",
                        "firstName",
                        "lastName",
                        "avatar",
                      ],
                      through: { attributes: [] }, // убираем данные из промежуточной таблицы
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });

    return projects.map((project) => {
      const p = project.toJSON();
      p.teams?.forEach((team) => {
        team.columns?.forEach((column) => {
          column.tasks?.forEach((task) => {
            task.assignedUsers?.forEach((user) => {
              user.avatar = user.avatar ? `${AVATAR_PATH}${user.avatar}` : null;
            });
          });
        });
      });
      return p;
    });
  }

  static async addProject(title, id_user) {
    const newProject = await Project.create({ title, id_user });
    await TeamOfProject.create({ id_project: newProject.id_project });
    return newProject;
  }

  static async renameProject(title, projectId) {
    const project = await Project.findOne({
      where: { id_project: projectId },
    });

    if (!project) {
      const error = new Error("Проект не найден");
      error.statusCode = 404;
      throw error;
    }

    project.title = title;
    await project.save();

    return project;
  }

  static async deleteProject(userId) {
    const project = await Project.findOne({
      where: { id_user: userId },
    });

    if (project) {
      await TeamOfProject.destroy({
        where: { id_project: project.id_project },
      });

      await Project.destroy({
        where: { id_project: project.id_project },
      });
    } else {
      const error = new Error("Проект не найден");
      error.statusCode = 404;
      throw error;
    }
  }

  static async addTeam(title, id_project) {
    return await Team.create({ title, id_project });
  }

  static async renameTeam(id_team, title) {
    const team = await Team.findOne({
      where: { id_team },
    });

    if (!team) {
      const error = new Error("Команда не найдена");
      error.statusCode = 404;
      throw error;
    }

    team.title = title;
    await team.save();
  }

  static async deleteTeam(id_team) {
    const deleted = await Team.destroy({
      where: { id_team },
    });

    if (!deleted) {
      const error = new Error("Команда не найдена");
      error.statusCode = 404;
      throw error;
    }
  }

  static async addColumn(id_team, title) {
    const lastColumn = await Column.findOne({
      where: { id_team },
      order: [["order", "DESC"]],
    });

    const newOrder = lastColumn ? lastColumn.order + 1 : 1;
    return await Column.create({ title, id_team, order: newOrder });
  }

  static async renameColumn(id_column, title) {
    const column = await Column.findOne({
      where: { id_column },
    });

    if (!column) {
      const error = new Error("Столбец не найден");
      error.statusCode = 404;
      throw error;
    }

    column.title = title;
    await column.save();
  }

  static async deleteColumn(id_column, id_team) {
    const deleted = await Column.destroy({
      where: { id_column },
    });

    const columns = await Column.findAll({
      where: { id_team },
      order: [["order", "ASC"]],
    });

    for (let i = 0; i < columns.length; i++) {
      columns[i].order = i + 1;
      await columns[i].save();
    }

    if (!deleted) {
      const error = new Error("Столбец не найден");
      error.statusCode = 404;
      throw error;
    }
  }

  static async changeColorColumn(id_column, color) {
    const column = await Column.findOne({
      where: { id_column },
    });

    if (!column) {
      const error = new Error("Столбец не найден");
      error.statusCode = 404;
      throw error;
    }

    column.color = color;
    await column.save();
  }

  static async addTask(content, id_column) {
    const deadline = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    return await Task.create({ content, id_column, deadline });
  }

  static async deleteTask(id_task) {
    const deleted = await Task.destroy({
      where: { id_task },
    });

    if (!deleted) {
      const error = new Error("Задача не найдена");
      error.statusCode = 404;
      throw error;
    }
  }

  static async changeStatusTask(id_task, currentUserId) {
    const task = await Task.findOne({
      where: { id_task },
      include: {
        model: Column,
        include: {
          model: Team,
          include: {
            model: Project,
            attributes: ["id_project", "id_user"],
          },
        },
      },
    });

    if (!task) {
      const error = new Error("Задача не найдена");
      error.statusCode = 404;
      throw error;
    }

    const projectOwnerId = task.Column.Team.Project.id_user;
    let newStatus;

    if (currentUserId === projectOwnerId) {
      newStatus = task.completed === "done" ? "in_progress" : "done";
    } else {
      if (task.completed === "done") {
        const error = new Error(
          "Вы не можете изменить статус выполненной задачи",
        );
        error.statusCode = 403;
        throw error;
      }
      newStatus =
        task.completed === "awaiting_approval"
          ? "in_progress"
          : "awaiting_approval";
    }

    task.completed = newStatus;
    await task.save();
    return task;
  }

  static async changeContentTask(id_task, content) {
    const task = await Task.findOne({
      where: { id_task },
    });

    if (!task) {
      const error = new Error("Задача не найдена");
      error.statusCode = 404;
      throw error;
    }

    task.content = content;
    await task.save();
  }

  static async changeDeadlineTask(id_task, deadline) {
    const task = await Task.findOne({
      where: { id_task },
    });

    if (!task) {
      const error = new Error("Задача не найдена");
      error.statusCode = 404;
      throw error;
    }

    task.deadline = deadline;
    await task.save();
  }

  static async moveTask(id_task, newColumnId) {
    const task = await Task.findOne({ where: { id_task } });

    if (!task) {
      const error = new Error("Задача не найдена");
      error.statusCode = 404;
      throw error;
    }

    task.id_column = newColumnId;
    await task.save();
  }
}

export { ProjectPlannerService };
