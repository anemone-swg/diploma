import { Sequelize } from "sequelize";

const sequelize = new Sequelize("diplom", "postgres", "222555", {
  host: "localhost",
  dialect: "postgres",
  logging: false,
});

export default sequelize;
