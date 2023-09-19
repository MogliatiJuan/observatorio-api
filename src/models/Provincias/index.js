import { DataTypes } from "sequelize";
import sequelize from "../../db/index.js";

export const Provincias = sequelize.define(
  "Provincias",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    nombre: {
      type: DataTypes.STRING(32),
      allowNull: false,
    },
  },
  {
    tableName: "provincias",
    timestamps: false,
    freezeTableName: true,
  }
);

export default Provincias;
