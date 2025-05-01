import { Router } from "express";
import { isAuthenticated } from "../middlewares.js";
import { Column, Project, Task, Team } from "../models/Export.js";

const router = Router();
router.use("/projects", isAuthenticated);

router.get("/projects", async (req, res) => {
  try {
    // const projects = await Project.findAll({ where: { id_user: userId } });
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
                },
              ],
            },
          ],
        },
      ],
    });

    res.json({ success: true, projects });
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
    const deleted = await Project.destroy({
      where: { id_user: req.session.user.id },
    });

    if (deleted) {
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
    res.status(500).json({ message: "Ошибка при создании проекта" });
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

export default router;
