import dotenv from "dotenv";

dotenv.config();

const config = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 8080,

  DB_HOST: process.env.DB_HOST,
  DB_NAME: process.env.DB_NAME,
  DB_DIALECT: process.env.DB_DIALECT,
  DB_USERNAME: process.env.DB_USERNAME,
  DB_PASSWORD: process.env.DB_PASSWORD,

  MORGAN_FORMAT: process.env.MORGAN_FORMAT,
  MORGAN_LOGGING: process.env.MORGAN_LOGGING,
};

export default config;
