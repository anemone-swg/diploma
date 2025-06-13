import {
  Column,
  Invitation,
  Project,
  Task,
  Team,
  TeamMembers,
  TeamOfProject,
  User,
} from "../models/export.js";
import { Op } from "sequelize";
import sequelize from "../config/db.js";

const AVATAR_PATH = process.env.AVATAR_PATH;

class ProjectPlannerTeamService {
  static async searchUsersByLogin(login, userId) {
    if (!login) {
      const error = new Error("Логин отсутствует");
      error.statusCode = 404;
      throw error;
    }

    const users = await User.findAll({
      where: {
        login: {
          [Op.iLike]: `%${login}%`,
        },
        id_user: {
          [Op.ne]: userId,
        },
      },
      attributes: [
        "id_user",
        "login",
        "firstName",
        "lastName",
        "avatar",
        "role",
      ],
    });

    return users.map((user) => {
      return {
        ...user.dataValues,
        avatar: user.avatar ? `${AVATAR_PATH}${user.avatar}` : null,
      };
    });
  }

  static async inviteUser(fromUserId, toUserId, id_project) {
    await Invitation.destroy({
      where: {
        fromUserId,
        toUserId,
        id_project,
      },
    });

    await Invitation.create({
      fromUserId,
      toUserId,
      status: "pending",
      id_project,
    });
  }

  static async getSentInvites(fromUserId) {
    return await Invitation.findAll({
      where: { fromUserId },
    });
  }

  static async cancelInvite(fromUserId, toUserId) {
    await Invitation.destroy({
      where: {
        fromUserId,
        toUserId,
      },
    });
  }

  static async showInvitations(toUserId) {
    const invites = await Invitation.findAll({
      where: { toUserId },
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

    return invites.map((invite) => {
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
          avatar: fromUser.avatar ? `${AVATAR_PATH}${fromUser.avatar}` : null,
        },
        projectTitle: project.title,
      };
    });
  }

  static async acceptInvite(id_invite, id_user) {
    const inv = await Invitation.findOne({
      where: {
        id_invite,
      },
    });

    if (!inv) {
      const error = new Error("Приглашение отсутствует");
      error.statusCode = 404;
      throw error;
    }

    inv.status = "accepted";
    await inv.save();

    const teamOfProject = await TeamOfProject.findOne({
      where: { id_project: inv.id_project },
    });

    if (!teamOfProject) {
      const error = new Error("Команда проекта отсутствует");
      error.statusCode = 404;
      throw error;
    }

    await TeamMembers.create({
      id_user,
      id_teamOfProject: teamOfProject.id_teamOfProject,
    });
  }

  static async declineInvite(id_invite) {
    const inv = await Invitation.findOne({
      where: {
        id_invite,
      },
    });

    if (!inv) {
      const error = new Error("Команда проекта отсутствует");
      error.statusCode = 404;
      throw error;
    }

    inv.status = "declined";
    await inv.save();
  }

  static async showTeam(id_project) {
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
      const error = new Error("Команда проекта отсутствует");
      error.statusCode = 404;
      throw error;
    }

    return (teamOfProject.teamMembers || []).map((member) => {
      const user = member.user;
      return {
        ...user.dataValues,
        avatar: user.avatar ? `${AVATAR_PATH}${user.avatar}` : null,
      };
    });
  }

  static async deleteFromTeam(id_user, id_project) {
    const team = await TeamOfProject.findOne({
      where: { id_project },
    });

    if (!team) {
      const error = new Error("Команда проекта отсутствует");
      error.statusCode = 404;
      throw error;
    }

    const teamId = team.id_teamOfProject;

    await TeamMembers.destroy({
      where: {
        id_user,
        id_teamOfProject: teamId,
      },
    });

    await Invitation.destroy({
      where: {
        toUserId: id_user,
        id_project,
      },
    });

    const tasks = await Task.findAll({
      attributes: ["id_task"],
      include: [
        {
          model: Column,
          attributes: [],
          required: true,
          include: [
            {
              model: Team,
              attributes: [],
              required: true,
              where: {
                id_project,
              },
            },
          ],
        },
      ],
      raw: true,
    });

    const taskIds = tasks.map((t) => t.id_task);

    if (taskIds.length > 0) {
      await sequelize.models.taskUsers.destroy({
        where: {
          id_user,
          id_task: taskIds,
        },
      });
    }
  }

  static async assignToTask(user, task) {
    const loadedTask = await Task.findByPk(task.id_task);
    const loadedUser = await User.findByPk(user.id_user);

    if (!loadedTask || !loadedUser) {
      const error = new Error("Задача и/или пользователь не найдены");
      error.statusCode = 404;
      throw error;
    }

    await loadedTask.addAssignedUser(loadedUser);

    return {
      id_user: loadedUser.id_user,
      login: loadedUser.login,
      firstName: loadedUser.firstName,
      lastName: loadedUser.lastName,
      avatar: loadedUser.avatar ? `${AVATAR_PATH}${loadedUser.avatar}` : null,
    };
  }

  static async unassignToTask(user, task) {
    const loadedTask = await Task.findByPk(task.id_task);
    const loadedUser = await User.findByPk(user.id_user);

    if (!loadedTask || !loadedUser) {
      const error = new Error("Задача и/или пользователь не найдены");
      error.statusCode = 404;
      throw error;
    }

    await loadedTask.removeAssignedUser(loadedUser);
  }

  static async openProject(id_user, id_project) {
    const project = await Project.findOne({
      where: { id_project },
      include: [
        {
          model: TeamOfProject,
          as: "teamOfProject",
          include: [
            {
              model: TeamMembers,
              as: "teamMembers",
              where: { id_user },
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
      (project.id_user !== id_user &&
        project.teamOfProject?.teamMembers?.length === 0)
    ) {
      const error = new Error("Нет доступа к проекту");
      error.statusCode = 403;
      throw error;
    }

    if (project) {
      project.teams?.forEach((team) => {
        team.columns?.forEach((column) => {
          column.tasks?.forEach((task) => {
            task.assignedUsers?.forEach((user) => {
              if (user.avatar && !user.avatar.startsWith("http")) {
                user.avatar = `${AVATAR_PATH}${user.avatar}`;
              }
            });
          });
        });
      });
    }
    return project;
  }
}

export { ProjectPlannerTeamService };
