import { DataTypes } from "sequelize";
import sequelize from "../../db/index.js";
import Roles from "../Roles/index.js";

const Usuarios = sequelize.define(
  "usuarios",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    matricula: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      set(nombre) {
        this.setDataValue("nombre", nombre.toUpperCase());
      },
    },
    apellido: {
      type: DataTypes.STRING,
      allowNull: false,
      set(apellido) {
        this.setDataValue("apellido", apellido.toUpperCase());
      },
    },
    email: {
      type: DataTypes.STRING(125),
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: true,
      },
    },
    dni: {
      type: DataTypes.INTEGER(8).UNSIGNED,
      unique: true,
      validate: {
        isNumeric: true,
        isInt: true,
        len: [7, 8],
      },
    },
  },
  {
    tableName: "usuarios",
    timestamps: true,
    paranoid: true,
    freezeTableName: true,
  }
);

export default Usuarios;
