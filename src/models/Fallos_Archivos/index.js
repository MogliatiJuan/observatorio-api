import { DataTypes } from "sequelize";
import sequelize from "../../db/index.js";
import Fallos from "../Fallos/index.js";

export const Fallos_Archivos = sequelize.define(
  "Fallos_Archivos",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    idFallo: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    filename: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "fallos_archivos",
    timestamps: true,
    freezeTableName: true,
    paranoid: true,
  }
);

export default Fallos_Archivos;
