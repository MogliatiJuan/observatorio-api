import { DataTypes } from "sequelize";
import sequelize from "../../db/index.js";
import Fallos from "../Fallos/index.js";
import Etiquetas from "../Etiquetas/index.js";

export const Etiquetas_x_Fallos = sequelize.define(
  "Etiquetas_x_Fallos",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
  },
  {
    tableName: "etiquetas_x_fallos",
    freezeTableName: true,
    timestamps: false,
  }
);

Fallos.belongsToMany(Etiquetas, {
  through: "Etiquetas_x_Fallos",
  foreignKey: "idFallo",
});
Etiquetas.belongsToMany(Fallos, {
  through: "Etiquetas_x_Fallos",
  foreignKey: "idTags",
});

export default Etiquetas_x_Fallos;
