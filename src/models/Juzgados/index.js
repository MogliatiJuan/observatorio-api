import { DataTypes } from "sequelize";
import sequelize from "../../db/index.js";
import Departamentos from "../Departamentos/index.js";
import Ciudades from "../Ciudades/index.js";

export const Juzgados = sequelize.define(
  "Juzgados",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    id_tipo: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    nombre: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    id_departamento: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_ciudad: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    juez: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    estado: {
      type: DataTypes.TINYINT,
      allowNull: false,
    },
  },
  {
    tableName: "juzgados",
    timestamps: false,
    freezeTableName: true,
  }
);

Juzgados.belongsTo(Departamentos, { foreignKey: "id_departamento" });
Juzgados.belongsTo(Ciudades, { foreignKey: "id_ciudad" });

export default Juzgados;
