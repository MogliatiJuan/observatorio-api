import { DataTypes } from "sequelize";
import sequelize from "../../db/index.js";
import Juzgados from "../Juzgados/index.js";
import Tipo_Juicio from "../Tipo_Juicio/index.js";
import Reclamos from "../Reclamos/index.js";
import Rubros from "../Rubros/index.js";
import Empresas from "../Empresas/index.js";

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
    causas: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rubro: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    tribunalid: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
    summary: {
      type: DataTypes.STRING(100),
    },
  },
  {
    tableName: "fallo",
    timestamps: false,
    freezeTableName: true,
  }
);

Fallos.belongsTo(Tipo_Juicio, { foreignKey: "tipojuicio" });
Fallos.belongsTo(Reclamos, { foreignKey: "causas" });
Fallos.belongsTo(Rubros, { foreignKey: "rubro" });
Fallos.belongsTo(Juzgados, { foreignKey: "tribunalid" });
Fallos.belongsTo(Reclamos, { foreignKey: "causas" });

export default Fallos;
