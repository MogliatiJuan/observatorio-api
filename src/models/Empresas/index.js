import { DataTypes } from "sequelize";
import sequelize from "../../db/index.js";

export const Empresas = sequelize.define(
  "Empresas",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    razon_social: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    cuit: {
      type: DataTypes.STRING(13),
      allowNull: false,
    },
    direccion: {
      type: DataTypes.STRING(66),
      allowNull: true,
    },
    servicio: {
      type: DataTypes.STRING(77),
      allowNull: true,
    },
  },
  {
    tableName: "empresas",
    timestamps: false,
    freezeTableName: true,
  }
);

export default Empresas;
