import { DataTypes } from "sequelize";
import sequelize from "../../db/index.js";
import Fallos from "../Fallos/index.js";
import Rubros from "../Rubros/index.js";

export const Rubros_x_Fallos = sequelize.define(
  "Rubros_x_Fallos",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
  },
  {
    tableName: "rubros_x_fallos",
    freezeTableName: true,
    timestamps: false,
  }
);

Fallos.belongsToMany(Rubros, {
  through: "Rubros_x_Fallos",
  foreignKey: "idFallo",
});
Rubros.belongsToMany(Fallos, {
  through: "Rubros_x_Fallos",
  foreignKey: "idRubro",
});

export default Rubros_x_Fallos;
