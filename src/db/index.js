import { Sequelize } from "sequelize";
import config from "../config/index.js";

const {
  DB_DIALECT,
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_USERNAME,
  LOGGING,
  DB_PORT,
  SEQUELIZE_SYNC_ALTER,
} = config;

const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: DB_DIALECT,
  logging: LOGGING === "true",
  dialectOptions: {
    connectTimeout: 30000,
  },
});

export const syncDb = async () => {
  try {
    await sequelize.sync({
      alter: SEQUELIZE_SYNC_ALTER === "true",
    });
    console.log("Setted connection");
  } catch (error) {
    console.log(error);
  }
};

export default sequelize;
