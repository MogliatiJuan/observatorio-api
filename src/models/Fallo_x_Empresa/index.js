import { DataTypes } from "sequelize";
import sequelize from "../../db/index.js";
import Fallos from "../Fallos/index.js";
import Empresas from "../Empresas/index.js";

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

Fallos.belongsToMany(Empresas, {
  through: "Fallo_x_Empresa",
  foreignKey: "idFallo",
});
Empresas.belongsToMany(Fallos, {
  through: "Fallo_x_Empresa",
  foreignKey: "idEmpresa",
});

export default Fallo_Empresa;
