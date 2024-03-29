import sequelize from "../../db/index.js";
import { DataTypes } from "sequelize";

const Roles = sequelize.define(
  "roles",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isAlpha: true,
        isUppercase: true,
      },
    },
  },
  {
    tableName: "roles",
    timestamps: false,
    freezeTableName: true,
  }
);

export default Roles;
