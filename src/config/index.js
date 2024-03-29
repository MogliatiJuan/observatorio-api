import dotenv from "dotenv";

dotenv.config();

const config = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 8080,

  DB_HOST: process.env.DB_HOST,
  DB_NAME: process.env.DB_NAME,
  DB_PORT: process.env.DB_PORT,
  DB_DIALECT: process.env.DB_DIALECT,
  DB_USERNAME: process.env.DB_USERNAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  SEQUELIZE_SYNC_ALTER: process.env.SEQUELIZE_SYNC_ALTER || false,
  LOGGING: process.env.LOGGING || false,

  FTP_HOST: process.env.FTP_HOST,
  FTP_USER: process.env.FTP_USER,
  FTP_PASSWORD: process.env.FTP_PASSWORD,

  MORGAN_FORMAT: process.env.MORGAN_FORMAT,
  MORGAN_LOGGING: process.env.MORGAN_LOGGING,

  SECRET_KEY: process.env.SECRET_KEY,
};

export default config;
