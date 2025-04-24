import User from "./User.js";
import DailyTask from "./DailyTask.js";

// Один пользователь может иметь много задач
User.hasMany(DailyTask, { foreignKey: "id_user", onDelete: "CASCADE" });

// Одна задача принадлежит одному пользователю
DailyTask.belongsTo(User, { foreignKey: "id_user" });

export { User, DailyTask };
