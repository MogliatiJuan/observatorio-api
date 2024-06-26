import { DataTypes } from "sequelize";
import sequelize from "../../db/index.js";

export const Fallo_Empresa = sequelize.define(
  "Fallo_x_Empresa",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
  },
  {
    tableName: "fallo_x_empresa",
    freezeTableName: true,
    timestamps: false,
  }
);

export default Fallo_Empresa;
