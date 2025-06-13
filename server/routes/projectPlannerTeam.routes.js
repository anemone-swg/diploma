import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { ProjectPlannerTeamController } from "../controllers/projectPlannerTeam.controller.js";

const router = Router();
router.use("/team", isAuthenticated);

router.get(
  "/team/search_users/:login",
  ProjectPlannerTeamController.searchUsersByLogin,
);

router.post("/team/invite", ProjectPlannerTeamController.inviteUser);

router.get(
  "/team/get_sent_invites",
  ProjectPlannerTeamController.getSentInvites,
);

router.delete("/team/cancel_invite", ProjectPlannerTeamController.cancelInvite);

router.get(
  "/team/show_invitations",
  ProjectPlannerTeamController.showInvitations,
);

router.put("/team/accept_invite", ProjectPlannerTeamController.acceptInvite);

router.put("/team/decline_invite", ProjectPlannerTeamController.declineInvite);

router.get("/team/show_team/:projectId", ProjectPlannerTeamController.showTeam);

router.delete(
  "/team/delete_from_team",
  ProjectPlannerTeamController.deleteFromTeam,
);

router.post("/team/assign_to_task", ProjectPlannerTeamController.assignToTask);

router.delete(
  "/team/unassign_from_task",
  ProjectPlannerTeamController.unassignToTask,
);

router.get(
  "/team/open_project/:projectId",
  ProjectPlannerTeamController.openProject,
);

router.get("/team/me", ProjectPlannerTeamController.getUser);

export default router;
