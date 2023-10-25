import { DataTypes } from "sequelize";
import sequelize from "../../db/index.js";

export const Rubros = sequelize.define(
  "Rubros",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    rubro: {
      type: DataTypes.STRING(46),
      allowNull: false,
    },
  },
  {
    tableName: "rubros",
    freezeTableName: true,
    timestamps: false,
  }
);

export default Rubros;
