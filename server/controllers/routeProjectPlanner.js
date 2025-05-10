import { Router } from "express";
import { isAuthenticated } from "../middlewares.js";
import {
  Column,
  Project,
  Task,
  Team,
  TeamOfProject,
  User,
} from "../models/Export.js";

const router = Router();
router.use("/projects", isAuthenticated);

router.get("/projects", async (req, res) => {
  try {
    const projects = await Project.findAll({
      where: { id_user: req.session.user.id },
      include: [
        {
          model: Team,
          as: "teams",
          include: [
            {
              model: Column,
              as: "columns",
              include: [
                {
                  model: Task,
                  as: "tasks",
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

    // Добавим полный путь к аватарам
    const normalizedProjects = projects.map((project) => {
      const p = project.toJSON();
      p.teams?.forEach((team) => {
        team.columns?.forEach((column) => {
          column.tasks?.forEach((task) => {
            task.assignedUsers?.forEach((user) => {
              user.avatar = user.avatar
                ? `http://localhost:5000/uploads/${user.avatar}`
                : null;
            });
          });
        });
      });
      return p;
    });

    res.json({ success: true, projects: normalizedProjects });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
});

router.post("/projects/add", async (req, res) => {
  try {
    const { title } = req.body;
    const id_user = req.session.user.id;
    const newProject = await Project.create({ title, id_user });
    await TeamOfProject.create({ id_project: newProject.id_project });

    res.status(201).json(newProject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ошибка при создании проекта" });
  }
});

router.put("/projects/rename/:projectId", async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title } = req.body;
    const userId = req.session.user.id;

    if (!title || !userId) {
      return res
        .status(400)
        .json({ success: false, message: "Недостаточно данных" });
    }

    const project = await Project.findOne({
      where: { id_project: projectId, id_user: userId },
    });

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Проект не найден" });
    }

    project.title = title;
    await project.save();

    res.json({ success: true, project });
  } catch (error) {
    console.error("Ошибка при обновлении проекта:", error);
    res.status(500).json({ success: false, message: "Ошибка сервера" });
  }
});

router.delete("/projects/delete", async (req, res) => {
  try {
    const project = await Project.findOne({
      where: { id_user: req.session.user.id },
    });

    if (project) {
      await TeamOfProject.destroy({
        where: { id_project: project.id_project },
      });

      await Project.destroy({
        where: { id_project: project.id_project },
      });

      res.json({ success: true });
    } else {
      res.status(404).json({ success: false, message: "Проект не найден" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
});

router.post("/projects/teams/add", async (req, res) => {
  try {
    const { title, id_project } = req.body;
    const newTeam = await Team.create({ title, id_project });

    res.status(201).json(newTeam);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ошибка при создании команды проекта" });
  }
});

router.put("/projects/teams/rename/:teamId", async (req, res) => {
  try {
    const { teamId } = req.params;
    const { title, id_project } = req.body;

    if (!title || !id_project) {
      return res
        .status(400)
        .json({ success: false, message: "Недостаточно данных" });
    }

    const team = await Team.findOne({
      where: { id_project: id_project, id_team: teamId },
    });

    if (!team) {
      return res
        .status(404)
        .json({ success: false, message: "Команда не найдена" });
    }

    team.title = title;
    await team.save();

    res.json({ success: true, team });
  } catch (error) {
    console.error("Ошибка при обновлении команды:", error);
    res.status(500).json({ success: false, message: "Ошибка сервера" });
  }
});

router.delete("/projects/teams/delete/:teamId", async (req, res) => {
  try {
    const { teamId } = req.params;

    const deleted = await Team.destroy({
      where: { id_team: teamId },
    });

    if (deleted) {
      res.json({ success: true });
    } else {
      res.status(404).json({ success: false, message: "Команда не найдена" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
});

router.post("/projects/teams/columns/add", async (req, res) => {
  try {
    const { title, id_team } = req.body;
    const newColumn = await Column.create({ title, id_team });

    res.status(201).json(newColumn);
  } catch (error) {
    console.error("Ошибка при создании столбца:", error);
    res.status(500).json({ message: "Ошибка при создании столбца команды" });
  }
});

router.put("/projects/teams/columns/rename/:columnId", async (req, res) => {
  try {
    const { columnId } = req.params;
    const { title } = req.body;

    if (!title || !columnId) {
      return res
        .status(400)
        .json({ success: false, message: "Недостаточно данных" });
    }

    const column = await Column.findOne({
      where: { id_column: columnId },
    });

    if (!column) {
      return res
        .status(404)
        .json({ success: false, message: "Столбец не найден" });
    }

    column.title = title;
    await column.save();

    res.json({ success: true, column });
  } catch (error) {
    console.error("Ошибка при обновлении столбца:", error);
    res.status(500).json({ success: false, message: "Ошибка сервера" });
  }
});

router.delete("/projects/teams/columns/delete/:columnId", async (req, res) => {
  try {
    const { columnId } = req.params;

    const deleted = await Column.destroy({
      where: { id_column: columnId },
    });

    if (deleted) {
      res.json({ success: true });
    } else {
      res.status(404).json({ success: false, message: "Столбец не найден" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
});

router.put(
  "/projects/teams/columns/change_color/:columnId",
  async (req, res) => {
    try {
      const { columnId } = req.params;
      const { color } = req.body;

      if (!color || !columnId) {
        return res
          .status(400)
          .json({ success: false, message: "Недостаточно данных" });
      }

      const column = await Column.findOne({
        where: { id_column: columnId },
      });

      if (!column) {
        return res
          .status(404)
          .json({ success: false, message: "Столбец не найден" });
      }

      column.color = color;
      await column.save();

      res.json({ success: true, column });
    } catch (error) {
      console.error("Ошибка при обновлении столбца:", error);
      res.status(500).json({ success: false, message: "Ошибка сервера" });
    }
  },
);

router.post("/projects/teams/columns/tasks/add", async (req, res) => {
  try {
    const { content, id_column } = req.body;
    const deadline = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const newTask = await Task.create({ content, id_column, deadline });

    res.status(201).json(newTask);
  } catch (error) {
    console.error("Ошибка при создании задачи:", error);
    res.status(500).json({ message: "Ошибка при создании задачи" });
  }
});

router.delete(
  "/projects/teams/columns/tasks/delete/:taskId",
  async (req, res) => {
    try {
      const { taskId } = req.params;

      const deleted = await Task.destroy({
        where: { id_task: taskId },
      });

      if (deleted) {
        res.json({ success: true });
      } else {
        res.status(404).json({ success: false, message: "Задача не найдена" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false });
    }
  },
);

router.put(
  "/projects/teams/columns/tasks/change_status/:taskId",
  async (req, res) => {
    try {
      const { taskId } = req.params;

      if (!taskId) {
        return res
          .status(400)
          .json({ success: false, message: "Недостаточно данных" });
      }

      const task = await Task.findOne({
        where: { id_task: taskId },
      });

      if (!task) {
        return res
          .status(404)
          .json({ success: false, message: "Задача не найдена" });
      }

      task.completed = !task.completed;
      await task.save();

      res.json({ success: true, task });
    } catch (error) {
      console.error("Ошибка при обновлении задачи:", error);
      res.status(500).json({ success: false, message: "Ошибка сервера" });
    }
  },
);

router.put(
  "/projects/teams/columns/tasks/change_content/:taskId",
  async (req, res) => {
    try {
      const { taskId } = req.params;
      const { content } = req.body;

      if (!taskId || !content) {
        return res
          .status(400)
          .json({ success: false, message: "Недостаточно данных" });
      }

      const task = await Task.findOne({
        where: { id_task: taskId },
      });

      if (!task) {
        return res
          .status(404)
          .json({ success: false, message: "Задача не найдена" });
      }

      task.content = content;
      await task.save();

      res.json({ success: true, task });
    } catch (error) {
      console.error("Ошибка при обновлении задачи:", error);
      res.status(500).json({ success: false, message: "Ошибка сервера" });
    }
  },
);

router.put(
  "/projects/teams/columns/tasks/change_deadline/:taskId",
  async (req, res) => {
    try {
      const { taskId } = req.params;
      const { deadline } = req.body;

      if (!taskId) {
        return res
          .status(400)
          .json({ success: false, message: "Недостаточно данных" });
      }

      const task = await Task.findOne({
        where: { id_task: taskId },
      });

      if (!task) {
        return res
          .status(404)
          .json({ success: false, message: "Задача не найдена" });
      }

      task.deadline = deadline;
      await task.save();

      res.json({ success: true, task });
    } catch (error) {
      console.error("Ошибка при обновлении задачи:", error);
      res.status(500).json({ success: false, message: "Ошибка сервера" });
    }
  },
);

router.post("/projects/teams/columns/tasks/move", async (req, res) => {
  const { taskId, newColumnId } = req.body;

  try {
    const task = await Task.findOne({ where: { id_task: taskId } });

    if (!task) {
      return res.status(404).json({ message: "Задача не найдена" });
    }

    task.id_column = newColumnId;
    await task.save();

    res.json({ success: true, message: "Задача перемещена" });
  } catch (error) {
    console.error("Ошибка при перемещении задачи:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

export default router;
