import { Router } from "express";
import { DailyTask } from "../models/Export.js";
import { isAuthenticated } from "../middlewares.js";

const router = Router();

router.use("/tasks", isAuthenticated);

// Получить задачи текущего пользователя
router.get("/tasks", async (req, res) => {
  try {
    const userId = req.session.user.id;
    const tasks = await DailyTask.findAll({ where: { id_user: userId } });
    res.json({ success: true, tasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
});

router.post("/tasks/add", async (req, res) => {
  try {
    const { title, due_date, description } = req.body;
    const userId = req.session.user.id;

    // Установить created_at автоматически
    const newTask = await DailyTask.create({
      id_user: userId,
      title,
      description: description || null, // Если description не передан, установить null
      due_date: due_date || null, // Если due_date не передан, установить null
      created_at: new Date(), // Установить текущую дату и время
    });

    res.json({ success: true, task: newTask });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Ошибка создания задачи" });
  }
});

// Обновить статус задачи
router.put("/tasks/toggle_complete/:id_task", async (req, res) => {
  try {
    const task = await DailyTask.findByPk(req.params.id_task);
    if (!task) {
      return res.status(404).json({ message: "Задача не найдена" });
    }
    task.completed = !task.completed;
    await task.save();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Ошибка при обновлении задачи" });
  }
});

router.put("/tasks/change_due_date/:id_task", async (req, res) => {
  try {
    const { id_task } = req.params;
    const { due_date } = req.body;

    // Если поле пустое, установить null
    const parsedDate = due_date ? new Date(due_date) : null;

    if (due_date && isNaN(parsedDate.getTime())) {
      return res
        .status(400)
        .json({ success: false, message: "Некорректная дата" });
    }

    await DailyTask.update(
      { due_date: parsedDate },
      { where: { id_task: id_task } },
    );

    res.json({ success: true });
  } catch (error) {
    console.error("Ошибка при обновлении даты выполнения:", error);
    res.status(500).json({ success: false, message: "Ошибка сервера" });
  }
});

router.put("/tasks/save_desc/:id_task", async (req, res) => {
  const { id_task } = req.params;
  let { description } = req.body;

  if (description === "") description = null;

  try {
    const updated = await DailyTask.update(
      { description },
      { where: { id_task: id_task } },
    );

    if (updated[0] === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Задача не найдена" });
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Ошибка при обновлении описания:", error);
    res.status(500).json({ success: false, message: "Ошибка сервера" });
  }
});

router.put("/tasks/save_title/:id_task", async (req, res) => {
  const { id_task } = req.params;
  let { title } = req.body;

  if (title === "") title = null;

  try {
    const updated = await DailyTask.update(
      { title },
      { where: { id_task: id_task } },
    );

    if (updated[0] === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Задача не найдена" });
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Ошибка при обновлении описания:", error);
    res.status(500).json({ success: false, message: "Ошибка сервера" });
  }
});

router.delete("/tasks/delete/:id_task", async (req, res) => {
  const { id_task } = req.params;

  try {
    const deletedCount = await DailyTask.destroy({
      where: { id_task: id_task, id_user: req.session.user.id },
    });

    if (deletedCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Задача не найдена" });
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Ошибка при удалении задачи:", error);
    res.status(500).json({ success: false, message: "Ошибка сервера" });
  }
});

export default router;
