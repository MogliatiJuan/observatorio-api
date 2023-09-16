import { DataTypes } from "sequelize";
import sequelize from "../../db/index.js";
import moment from "moment/moment.js";

export const Fallos = sequelize.define(
  "Fallo",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    agent: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    tipojuicio: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    causas: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },
    rubro: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    defendant: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    tribunalid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tribunal: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },
    punitive: {
      type: DataTypes.DECIMAL(11, 2),
    },
    moral: {
      type: DataTypes.DECIMAL(11, 2),
    },
    patrimonial: {
      type: DataTypes.DECIMAL(11, 2),
    },
    summary: {
      type: DataTypes.STRING(100),
    },
  },
  {
    tableName: "fallo",
    timestamps: false,
    freezeTableName: true,
  }
);

export default Fallos;
