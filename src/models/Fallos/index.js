import { DataTypes } from "sequelize";
import sequelize from "../../db/index.js";
import Juzgados from "../Juzgados/index.js";
import Tipo_Juicio from "../Tipo_Juicio/index.js";
import Fallos_Archivos from "../Fallos_Archivos/index.js";
import Divisas from "../Divisas/index.js";

export const Fallos = sequelize.define(
  "Fallo",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    agent: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    tipojuicio: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    tribunalid: {
      type: DataTypes.INTEGER,
    },
    punitive: {
      type: DataTypes.DECIMAL(11, 2),
    },
    moral: {
      type: DataTypes.DECIMAL(11, 2),
    },
    patrimonial: {
      type: DataTypes.DECIMAL(11, 2),
    },
    idDivisa: {
      type: DataTypes.INTEGER,
      defaultValue: 7,
    },
    summary: {
      type: DataTypes.STRING(600),
    },
  },
  {
    tableName: "fallo",
    timestamps: true,
    paranoid: true,
    freezeTableName: true,
  }
);

Fallos.belongsTo(Tipo_Juicio, { foreignKey: "tipojuicio" });
Fallos.belongsTo(Juzgados, { foreignKey: "tribunalid" });
Fallos.hasMany(Fallos_Archivos, { foreignKey: "idFallo" });
Fallos.belongsTo(Divisas, {
  foreignKey: "idDivisa",
  targetKey: "id",
});

export default Fallos;
