import { DataTypes } from "sequelize";
import sequelize from "../../db/index.js";
import Fallos from "../Fallos/index.js";
import Empresas from "../Empresas/index.js";

export const Fallo_x_Actor = sequelize.define(
  "Fallo_x_Actor",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
  },
  {
    tableName: "fallo_x_actor",
    freezeTableName: true,
    timestamps: false,
  }
);

export default Fallo_x_Actor;
