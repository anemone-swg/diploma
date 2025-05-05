import {
  Column,
  DailyTask,
  Invitation,
  Project,
  Task,
  Team,
  User,
} from "./Export.js";

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

// Один пользователь может отправить много приглашений
User.hasMany(Invitation, {
  foreignKey: "fromUserId",
  as: "sentInvitations",
  onDelete: "CASCADE",
});
// Один пользователь может получить много приглашений
User.hasMany(Invitation, {
  foreignKey: "toUserId",
  as: "receivedInvitations",
  onDelete: "CASCADE",
});

// Каждое приглашение связано с отправителем
Invitation.belongsTo(User, { foreignKey: "fromUserId", as: "fromUser" });
// Каждое приглашение связано с получателем
Invitation.belongsTo(User, { foreignKey: "toUserId", as: "toUser" });

Project.hasMany(Invitation, {
  foreignKey: "id_project",
  as: "invitations",
  onDelete: "CASCADE",
});
Invitation.belongsTo(Project, { foreignKey: "id_project", as: "project" });
