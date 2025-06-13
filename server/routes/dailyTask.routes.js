import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { DailyTaskController } from "../controllers/dailyTask.controller.js";

const router = Router();

router.use("/daily-tasks", isAuthenticated);

router.get("/daily-tasks", DailyTaskController.getTasks);

router.post("/daily-tasks/add", DailyTaskController.addTask);

router.put(
  "/daily-tasks/toggle_complete/:id_task",
  DailyTaskController.toggleCompleteStatus,
);

router.put(
  "/daily-tasks/change_due_date/:id_task",
  DailyTaskController.changeDueDate,
);

router.put(
  "/daily-tasks/save_desc/:id_task",
  DailyTaskController.changeDescription,
);

router.put("/daily-tasks/save_title/:id_task", DailyTaskController.changeTitle);

router.delete("/daily-tasks/delete/:id_task", DailyTaskController.deleteTask);

export default router;
