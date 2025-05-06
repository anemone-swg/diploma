import {
  Column,
  DailyTask,
  Invitation,
  Project,
  Task,
  Team,
  TeamMembers,
  TeamOfProject,
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

Project.hasOne(TeamOfProject, {
  foreignKey: "id_project",
  as: "teamOfProject",
  onDelete: "CASCADE",
});
TeamOfProject.belongsTo(Project, { foreignKey: "id_project", as: "project" });

TeamOfProject.hasMany(TeamMembers, {
  foreignKey: "id_teamOfProject",
  as: "teamMembers",
  onDelete: "CASCADE",
});
TeamMembers.belongsTo(TeamOfProject, {
  foreignKey: "id_teamOfProject",
  as: "teamOfProject",
});

User.hasMany(TeamMembers, {
  foreignKey: "id_user",
  as: "teamMembers",
  onDelete: "CASCADE",
});
TeamMembers.belongsTo(User, {
  foreignKey: "id_user",
  as: "user",
});
