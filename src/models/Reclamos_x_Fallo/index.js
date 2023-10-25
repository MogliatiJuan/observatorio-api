import { DataTypes } from "sequelize";
import sequelize from "../../db/index.js";
import Fallos from "../Fallos/index.js";
import Reclamos from "../Reclamos/index.js";

export const Reclamos_x_Fallo = sequelize.define(
  "Reclamos_x_Fallo",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
  },
  {
    tableName: "reclamos_x_fallo",
    freezeTableName: true,
    timestamps: false,
  }
);

Fallos.belongsToMany(Reclamos, {
  through: "Reclamos_x_Fallo",
  foreignKey: "idFallo",
});
Reclamos.belongsToMany(Fallos, {
  through: "Reclamos_x_Fallo",
  foreignKey: "idReclamo",
});

export default Reclamos_x_Fallo;
