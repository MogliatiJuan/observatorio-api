import { Sequelize } from "sequelize";
import sequelize from "../../db/index.js";

const Usuario_Rol = sequelize.define(
  "usuario_rol",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    idUsuario: {
      type: Sequelize.INTEGER,
    },
    idRol: {
      type: Sequelize.INTEGER,
    },
  },
  { freezeTableName: true }
);

export default Usuario_Rol;
