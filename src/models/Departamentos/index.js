import { DataTypes } from "sequelize";
import sequelize from "../../db/index.js";
import Provincia from "../Provincias/index.js";

export const Departamentos = sequelize.define(
  "Departamentos",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    nombre: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    id_provincia: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "departamentos",
    timestamps: false,
    freezeTableName: true,
  }
);

Departamentos.belongsTo(Provincia, { foreignKey: "id_provincia" });

export default Departamentos;
