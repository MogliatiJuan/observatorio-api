import { DataTypes } from "sequelize";
import sequelize from "../../db/index.js";
import Provincia from "../Provincias/index.js";

export const Ciudades = sequelize.define(
  "Ciudades",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    nombre: {
      type: DataTypes.STRING(256),
      allowNull: false,
    },
    idprovincia: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "ciudades",
    timestamps: false,
    freezeTableName: true,
  }
);

Ciudades.belongsTo(Provincia, { foreignKey: "idprovincia" });

export default Ciudades;
