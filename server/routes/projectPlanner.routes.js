import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { ProjectPlannerController } from "../controllers/projectPlanner.controller.js";

const router = Router();
["/projects", "/teams", "/columns", "/tasks"].forEach((path) => {
  router.use(path, isAuthenticated);
});

router.get("/projects", ProjectPlannerController.getProjects);

router.post("/projects/add", ProjectPlannerController.addProject);

router.put(
  "/projects/rename/:projectId",
  ProjectPlannerController.renameProject,
);

router.delete("/projects/delete", ProjectPlannerController.deleteProject);

router.post("/teams/add", ProjectPlannerController.addTeam);

router.put("/teams/rename/:teamId", ProjectPlannerController.renameTeam);

router.delete("/teams/delete/:teamId", ProjectPlannerController.deleteTeam);

router.post("/columns/add", ProjectPlannerController.addColumn);

router.put("/columns/rename/:columnId", ProjectPlannerController.renameColumn);

router.delete(
  "/columns/delete/:columnId/:teamId",
  ProjectPlannerController.deleteColumn,
);

router.put(
  "/columns/change_color/:columnId",
  ProjectPlannerController.changeColorColumn,
);

router.post("/tasks/add", ProjectPlannerController.addTask);

router.delete("/tasks/delete/:taskId", ProjectPlannerController.deleteTask);

router.put(
  "/tasks/change_status/:taskId",
  ProjectPlannerController.changeStatusTask,
);

router.put(
  "/tasks/change_content/:taskId",
  ProjectPlannerController.changeContentTask,
);

router.put(
  "/tasks/change_deadline/:taskId",
  ProjectPlannerController.changeDeadlineTask,
);

router.post("/tasks/move", ProjectPlannerController.moveTask);

export default router;
