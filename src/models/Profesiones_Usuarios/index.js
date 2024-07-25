import { DataTypes } from "sequelize";
import sequelize from "../../db/index.js";

const Profesiones_Usuarios = sequelize.define(
  "profesiones_usuarios",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    idProfesion: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    idUsuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  { freezeTableName: true, timestamps: true }
);

export default Profesiones_Usuarios;
