import { DataTypes } from "sequelize";
import sequelize from "../../db/index.js";

export const Etiquetas = sequelize.define(
  "Etiquetas",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    description: {
      type: DataTypes.STRING(65),
      allowNull: false,
    },
  },
  {
    tableName: "etiquetas",
    timestamps: false,
    freezeTableName: true,
  }
);

export default Etiquetas;
