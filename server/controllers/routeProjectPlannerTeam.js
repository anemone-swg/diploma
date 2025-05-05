import { Router } from "express";
import { isAuthenticated } from "../middlewares.js";
import { Op } from "sequelize";
import { Invitation, Project, User } from "../models/Export.js";

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
    const invited_users = await Invitation.findAll({
      where: { fromUserId: req.session.user.id },
      attributes: ["toUserId"],
    });

    const invitedIds = invited_users.map((inv) => inv.toUserId);

    res.json(invitedIds);
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

export default router;
