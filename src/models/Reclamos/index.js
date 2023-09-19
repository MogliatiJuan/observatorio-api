import { DataTypes } from "sequelize";
import sequelize from "../../db/index.js";

export const Reclamos = sequelize.define(
  "Reclamos",
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
    tableName: "reclamos",
    timestamps: false,
    freezeTableName: false,
  }
);

export default Reclamos;
