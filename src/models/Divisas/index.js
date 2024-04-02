import { DataTypes } from "sequelize";
import sequelize from "../../db/index.js";

export const Divisas = sequelize.define(
  "Divisas",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    codigoDivisa: {
      type: DataTypes.STRING(3),
      allowNull: false,
    },
    nombreDivisa: {
      type: DataTypes.STRING(50),
    },
    pais: {
      type: DataTypes.STRING(50),
    },
  },
  {
    tableName: "divisas",
    timestamps: false,
    freezeTableName: true,
  }
);

export default Divisas;
