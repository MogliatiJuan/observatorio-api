import { Sequelize } from "sequelize";
import config from "../config/index.js";

const { DB_DIALECT, DB_HOST, DB_NAME, DB_PASSWORD, DB_USERNAME } = config;

const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
  host: DB_HOST,
  dialect: DB_DIALECT,
});

export const syncDb = async () => {
  try {
    await sequelize.sync({
      alter: false,
    });
  } catch (error) {
    console.log(error);
  }
};

export default sequelize;
