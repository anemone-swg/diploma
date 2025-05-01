import { Column, DailyTask, Project, Task, Team, User } from "./Export.js";

// Один пользователь может иметь много задач
User.hasMany(DailyTask, { foreignKey: "id_user", onDelete: "CASCADE" });
// Одна задача принадлежит одному пользователю
DailyTask.belongsTo(User, { foreignKey: "id_user" });

User.hasMany(Project, { foreignKey: "id_user", onDelete: "CASCADE" });
Project.belongsTo(User, { foreignKey: "id_user" });

Project.hasMany(Team, {
  foreignKey: "id_project",
  as: "teams",
  onDelete: "CASCADE",
});
Team.belongsTo(Project, { foreignKey: "id_project" });

Team.hasMany(Column, {
  foreignKey: "id_team",
  as: "columns",
  onDelete: "CASCADE",
});
Column.belongsTo(Team, { foreignKey: "id_team" });

Column.hasMany(Task, {
  foreignKey: "id_column",
  as: "tasks",
  onDelete: "CASCADE",
});
Task.belongsTo(Column, { foreignKey: "id_column" });
