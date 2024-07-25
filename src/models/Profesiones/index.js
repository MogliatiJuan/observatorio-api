import { DataTypes } from "sequelize";
import sequelize from "../../db/index.js";

const Profesiones = sequelize.define(
  "profesiones",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    profesion: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "OTRO",
      set(profesion) {
        this.setDataValue("profesion", profesion.toUpperCase());
      },
    },
  },
  { freezeTableName: true, timestamps: false }
);

export default Profesiones;
