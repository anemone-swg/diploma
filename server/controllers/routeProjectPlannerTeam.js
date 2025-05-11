import { Router } from "express";
import { isAuthenticated } from "../middlewares.js";
import { Op } from "sequelize";
import {
  Column,
  Invitation,
  Project,
  Task,
  Team,
  TeamMembers,
  TeamOfProject,
  User,
} from "../models/Export.js";
import sequelize from "../db.js";

const router = Router();
router.use("/team", isAuthenticated);

router.get("/team/search_users/:login", async (req, res) => {
  const { login } = req.params;
  if (!login) return res.status(400).json({ error: "Login is required" });

  try {
    const users = await User.findAll({
      where: {
        login: {
          [Op.iLike]: `%${login}%`, // PostgresSQL регистронезависимый поиск
        },
        id_user: {
          [Op.ne]: req.session.user.id, // исключить текущего пользователя
        },
      },
      attributes: ["id_user", "login", "firstName", "lastName", "avatar"],
    });

    // Обновить путь к аватару
    const usersWithFullAvatars = users.map((user) => {
      return {
        ...user.dataValues,
        avatar: user.avatar
          ? `http://localhost:5000/uploads/${user.avatar}`
          : null,
      };
    });

    res.json(usersWithFullAvatars);
  } catch (error) {
    console.error("Ошибка при поиске пользователей:", error);
    res.status(500).json({ error: "Ошибка при поиске пользователей" });
  }
});

router.post("/team/invite", async (req, res) => {
  const { toUserId, projectId } = req.body;

  if (!toUserId || !req.session.user) {
    return res.status(400).json({ error: "Недостаточно данных" });
  }

  try {
    // Удаляем предыдущее приглашение, если есть
    await Invitation.destroy({
      where: {
        fromUserId: req.session.user.id,
        toUserId: toUserId,
        id_project: projectId,
      },
    });

    await Invitation.create({
      fromUserId: req.session.user.id,
      toUserId: toUserId,
      status: "pending",
      id_project: projectId,
    });

    res.json({ message: "Приглашение отправлено" });
  } catch (error) {
    console.error("Ошибка отправки приглашения:", error);
    res.status(500).json({ error: "Внутренняя ошибка" });
  }
});

router.get("/team/get_sent_invites", async (req, res) => {
  try {
    const invitations = await Invitation.findAll({
      where: { fromUserId: req.session.user.id },
    });

    res.json(invitations);
  } catch (error) {
    console.error("Ошибка при поиске приглашенных пользователей:", error);
    res
      .status(500)
      .json({ error: "Ошибка при поиске приглашенных пользователей" });
  }
});

router.delete("/team/cancel_invite", async (req, res) => {
  try {
    const { toUserId } = req.body;
    await Invitation.destroy({
      where: {
        fromUserId: req.session.user.id,
        toUserId,
      },
    });
    res.json({ success: true });
  } catch (error) {
    console.error("Ошибка при отмене приглашения:", error);
    res.status(500).json({ error: "Ошибка при отмене приглашения" });
  }
});

router.get("/team/show_invitations", async (req, res) => {
  try {
    const invites = await Invitation.findAll({
      where: { toUserId: req.session.user.id },
      include: [
        {
          model: User,
          as: "fromUser",
          attributes: ["id_user", "login", "firstName", "lastName", "avatar"],
        },
        {
          model: Project,
          as: "project",
          attributes: ["title"],
        },
      ],
    });

    const invitesWithFullAvatars = invites.map((invite) => {
      const fromUser = invite.fromUser?.dataValues || {};
      const project = invite.project?.dataValues || {};

      return {
        id_invite: invite.id_invite,
        fromUserId: invite.fromUserId,
        toUserId: invite.toUserId,
        id_project: invite.id_project,
        status: invite.status,
        createdAt: invite.createdAt,
        fromUser: {
          ...fromUser,
          avatar: fromUser.avatar
            ? `http://localhost:5000/uploads/${fromUser.avatar}`
            : null,
        },
        projectTitle: project.title,
      };
    });

    res.json(invitesWithFullAvatars);
  } catch (error) {
    console.error("Ошибка при получении приглашений:", error);
    res.status(500).json({ error: "Ошибка при получении приглашений" });
  }
});

router.put("/team/accept_invite", async (req, res) => {
  const { id_invite } = req.body;

  if (!id_invite || !req.session.user) {
    return res.status(400).json({ error: "Недостаточно данных" });
  }

  try {
    const inv = await Invitation.findOne({
      where: {
        id_invite: id_invite,
      },
    });

    if (!inv) {
      return res
        .status(404)
        .json({ success: false, message: "Не найдено приглашение" });
    }

    inv.status = "accepted";
    await inv.save();

    const teamOfProject = await TeamOfProject.findOne({
      where: { id_project: inv.id_project },
    });

    if (!teamOfProject) {
      return res
        .status(404)
        .json({ success: false, message: "Команда проекта не найдена" });
    }

    await TeamMembers.create({
      id_user: req.session.user.id,
      id_teamOfProject: teamOfProject.id_teamOfProject,
    });

    res.json({ success: true });
  } catch (error) {
    console.error("Ошибка при принятии приглашения:", error);
    res.status(500).json({ error: "Ошибка при принятии приглашения" });
  }
});

router.put("/team/decline_invite", async (req, res) => {
  const { id_invite } = req.body;

  if (!id_invite || !req.session.user) {
    return res.status(400).json({ error: "Недостаточно данных" });
  }

  try {
    const inv = await Invitation.findOne({
      where: {
        id_invite: id_invite,
      },
    });

    if (!inv) {
      return res
        .status(404)
        .json({ success: false, message: "Не найдено приглашение" });
    }

    inv.status = "declined";
    await inv.save();

    res.json({ success: true });
  } catch (error) {
    console.error("Ошибка при отмене приглашения:", error);
    res.status(500).json({ error: "Ошибка при отмене приглашения" });
  }
});

router.get("/team/show_team/:projectId", async (req, res) => {
  const id_project = req.params.projectId;

  try {
    const teamOfProject = await TeamOfProject.findOne({
      where: { id_project },
      include: [
        {
          model: TeamMembers,
          as: "teamMembers",
          include: [
            {
              model: User,
              as: "user",
              attributes: { exclude: ["password", "email", "role"] },
            },
          ],
        },
      ],
    });

    if (!teamOfProject) {
      return res.status(404).json({ error: "Команда не найдена" });
    }

    const users = (teamOfProject.teamMembers || []).map((member) => {
      const user = member.user;
      return {
        ...user.dataValues,
        avatar: user.avatar
          ? `http://localhost:5000/uploads/${user.avatar}`
          : null,
      };
    });

    res.json(users);
  } catch (error) {
    console.error("Ошибка при получении команды проекта:", error);
    res.status(500).json({ error: "Ошибка при получении команды проекта" });
  }
});

router.delete("/team/delete_from_team", async (req, res) => {
  try {
    const { user } = req.body;
    await TeamMembers.destroy({
      where: {
        id_user: user.id_user,
      },
    });
    await Invitation.destroy({
      where: {
        toUserId: user.id_user,
      },
    });
    await sequelize.models.taskUsers.destroy({
      where: {
        id_user: user.id_user,
      },
    });
    res.json({ success: true });
  } catch (error) {
    console.error("Ошибка при удалении участника команды из нее:", error);
    res
      .status(500)
      .json({ error: "Ошибка при удалении участника команды из нее:" });
  }
});

router.post("/team/assign_to_task", async (req, res) => {
  const { user, task } = req.body;

  try {
    const loadedTask = await Task.findByPk(task.id_task);
    const loadedUser = await User.findByPk(user.id_user);

    if (!loadedTask || !loadedUser) {
      return res
        .status(404)
        .json({ message: "Задача или пользователь не найдены" });
    }

    await loadedTask.addAssignedUser(loadedUser);

    res.json({
      id_user: loadedUser.id_user,
      login: loadedUser.login,
      firstName: loadedUser.firstName,
      lastName: loadedUser.lastName,
      avatar: loadedUser.avatar
        ? `http://localhost:5000/uploads/${loadedUser.avatar}`
        : null,
    });
  } catch (err) {
    console.error("Ошибка при назначении пользователя на задачу:", err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

router.delete("/team/unassign_from_task", async (req, res) => {
  const { user, task } = req.body;

  try {
    const loadedTask = await Task.findByPk(task.id_task);
    const loadedUser = await User.findByPk(user.id_user);

    if (!loadedTask || !loadedUser) {
      return res
        .status(404)
        .json({ message: "Задача или пользователь не найдены" });
    }

    await loadedTask.removeAssignedUser(loadedUser);

    res.json({ success: true });
  } catch (err) {
    console.error("Ошибка при удалении пользователя из задачи:", err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

router.get("/open_project/:projectId", async (req, res) => {
  const userId = req.session.user.id;
  const projectId = req.params.projectId;

  try {
    const project = await Project.findOne({
      where: { id_project: projectId },
      include: [
        {
          model: TeamOfProject,
          as: "teamOfProject",
          include: [
            {
              model: TeamMembers,
              as: "teamMembers",
              where: { id_user: userId },
              required: false,
            },
          ],
        },
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
                      through: { attributes: [] },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });

    // Проверка: если пользователь не владелец и не в команде — отказ
    if (
      !project ||
      (project.id_user !== userId &&
        project.teamOfProject?.teamMembers?.length === 0)
    ) {
      return res.status(403).json({ error: "Нет доступа к проекту." });
    }

    if (project) {
      project.teams?.forEach((team) => {
        team.columns?.forEach((column) => {
          column.tasks?.forEach((task) => {
            task.assignedUsers?.forEach((user) => {
              if (user.avatar && !user.avatar.startsWith("http")) {
                user.avatar = `http://localhost:5000/uploads/${user.avatar}`;
              }
            });
          });
        });
      });
    }

    res.json(project);
  } catch (error) {
    console.error("Ошибка при получении проекта:", error);
    res.status(500).json({ error: "Ошибка при получении проекта" });
  }
});

export default router;
