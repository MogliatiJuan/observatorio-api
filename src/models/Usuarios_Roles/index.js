import { DataTypes } from "sequelize";
import sequelize from "../../db/index.js";

const Usuario_Rol = sequelize.define(
  "usuario_rol",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    idUsuario: {
      type: DataTypes.INTEGER,
    },
    idRol: {
      type: DataTypes.INTEGER,
    },
  },
  { freezeTableName: true }
);

export default Usuario_Rol;
