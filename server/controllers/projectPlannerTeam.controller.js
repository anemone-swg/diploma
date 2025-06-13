import { ProjectPlannerTeamService } from "../services/projectPlannerTeam.service.js";
import { io } from "../server.js";

class ProjectPlannerTeamController {
  static async searchUsersByLogin(req, res) {
    try {
      const { login } = req.params;
      const users = await ProjectPlannerTeamService.searchUsersByLogin(
        login,
        req.session.user.id,
      );
      res.json({ users });
    } catch (error) {
      console.error("Ошибка при поиске пользователей:", error);
      const status = error.statusCode || 500;
      res.status(status).json({ error: error.message || "Ошибка сервера" });
    }
  }

  static async inviteUser(req, res) {
    try {
      const { toUserId, projectId } = req.body;
      await ProjectPlannerTeamService.inviteUser(
        req.session.user.id,
        toUserId,
        projectId,
      );
      io.emit("userInvited");
      res.sendStatus(200);
    } catch (error) {
      console.error("Ошибка отправки приглашения:", error);
      const status = error.statusCode || 500;
      res.status(status).json({ error: error.message || "Ошибка сервера" });
    }
  }

  static async getSentInvites(req, res) {
    try {
      const invitations = await ProjectPlannerTeamService.getSentInvites(
        req.session.user.id,
      );
      res.json({ invitations });
    } catch (error) {
      console.error("Ошибка при получении отправленных приглашений:", error);
      const status = error.statusCode || 500;
      res.status(status).json({ error: error.message || "Ошибка сервера" });
    }
  }

  static async cancelInvite(req, res) {
    try {
      const { toUserId } = req.body;
      await ProjectPlannerTeamService.cancelInvite(
        req.session.user.id,
        toUserId,
      );
      io.emit("inviteCanceled");
      res.sendStatus(200);
    } catch (error) {
      console.error("Ошибка при отмене приглашения:", error);
      const status = error.statusCode || 500;
      res.status(status).json({ error: error.message || "Ошибка сервера" });
    }
  }

  static async showInvitations(req, res) {
    try {
      const invites = await ProjectPlannerTeamService.showInvitations(
        req.session.user.id,
      );
      res.json({ invites });
    } catch (error) {
      console.error("Ошибка при получении приглашений:", error);
      const status = error.statusCode || 500;
      res.status(status).json({ error: error.message || "Ошибка сервера" });
    }
  }

  static async acceptInvite(req, res) {
    try {
      const { id_invite } = req.body;
      await ProjectPlannerTeamService.acceptInvite(
        id_invite,
        req.session.user.id,
      );
      io.emit("inviteAccepted");
      res.sendStatus(200);
    } catch (error) {
      console.error("Ошибка при принятии приглашения:", error);
      const status = error.statusCode || 500;
      res.status(status).json({ error: error.message || "Ошибка сервера" });
    }
  }

  static async declineInvite(req, res) {
    try {
      const { id_invite } = req.body;
      await ProjectPlannerTeamService.declineInvite(id_invite);
      io.emit("inviteDeclined");
      res.sendStatus(200);
    } catch (error) {
      console.error("Ошибка при отклонении приглашения:", error);
      const status = error.statusCode || 500;
      res.status(status).json({ error: error.message || "Ошибка сервера" });
    }
  }

  static async showTeam(req, res) {
    try {
      const id_project = req.params.projectId;
      const users = await ProjectPlannerTeamService.showTeam(id_project);
      res.json({ users });
    } catch (error) {
      console.error("Ошибка при получении команды проекта:", error);
      const status = error.statusCode || 500;
      res.status(status).json({ error: error.message || "Ошибка сервера" });
    }
  }

  static async deleteFromTeam(req, res) {
    try {
      const { userId, projectId } = req.body;
      await ProjectPlannerTeamService.deleteFromTeam(userId, projectId);
      io.emit("userDeletedFromTeam");
      res.sendStatus(200);
    } catch (error) {
      console.error("Ошибка при удалении участника команды из нее:", error);
      const status = error.statusCode || 500;
      res.status(status).json({ error: error.message || "Ошибка сервера" });
    }
  }

  static async assignToTask(req, res) {
    try {
      const { user, task } = req.body;
      const assignedUser = await ProjectPlannerTeamService.assignToTask(
        user,
        task,
      );
      io.emit("userAssignedToTask");
      res.json({ assignedUser });
    } catch (error) {
      console.error("Ошибка при назначении пользователя на задачу:", error);
      const status = error.statusCode || 500;
      res.status(status).json({ error: error.message || "Ошибка сервера" });
    }
  }

  static async unassignToTask(req, res) {
    try {
      const { user, task } = req.body;
      await ProjectPlannerTeamService.unassignToTask(user, task);
      io.emit("userUnassignedToTask");
      res.sendStatus(200);
    } catch (error) {
      console.error("Ошибка при откреплении пользователя от задачи:", error);
      const status = error.statusCode || 500;
      res.status(status).json({ error: error.message || "Ошибка сервера" });
    }
  }

  static async openProject(req, res) {
    try {
      const userId = req.session.user.id;
      const projectId = req.params.projectId;
      const project = await ProjectPlannerTeamService.openProject(
        userId,
        projectId,
      );
      res.json({
        project,
        currentUserId: req.session.user.id,
      });
    } catch (error) {
      console.error("Ошибка при получении проекта:", error);
      const status = error.statusCode || 500;
      res.status(status).json({ error: error.message || "Ошибка сервера" });
    }
  }

  static async getUser(req, res) {
    try {
      res.json(req.session.user.id);
    } catch (error) {
      console.error("Ошибка при поиске пользователя:", error);
      const status = error.statusCode || 500;
      res.status(status).json({ error: error.message || "Ошибка сервера" });
    }
  }
}

export { ProjectPlannerTeamController };
