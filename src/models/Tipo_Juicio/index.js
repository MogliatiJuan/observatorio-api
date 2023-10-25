import { DataTypes } from "sequelize";
import sequelize from "../../db/index.js";

export const Tipo_Juicio = sequelize.define(
  "Tipo_Juicio",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    description: {
      type: DataTypes.STRING(22),
      allowNull: false,
    },
  },
  {
    tableName: "tipojuicios",
    freezeTableName: false,
    timestamps: false,
  }
);

export default Tipo_Juicio;
