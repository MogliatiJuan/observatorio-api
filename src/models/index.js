import Empresas from "./Empresas/index.js";
import Fallo_x_Actor from "./Fallo_x_Actor/index.js";
import Fallos from "./Fallos/index.js";
import Profesiones from "./Profesiones/index.js";
import Profesiones_Usuarios from "./Profiones_Usuarios/index.js";
import Roles from "./Roles/index.js";
import Usuarios from "./Usuarios/index.js";
import Usuario_Rol from "./Usuarios_Roles/index.js";
import { Fallo_x_Empresa } from "./index.js";

export { default as Fallos } from "./Fallos/index.js";
export { default as Empresas } from "./Empresas/index.js";
export { default as Fallo_x_Empresa } from "./Fallo_x_Empresa/index.js";
export { default as Fallo_x_Actor } from "./Fallo_x_Actor/index.js";
export { default as Departamentos } from "./Departamentos/index.js";
export { default as Juzgados } from "./Juzgados/index.js";
export { default as Ciudades } from "./Ciudades/index.js";
export { default as Tipo_Juicio } from "./Tipo_Juicio/index.js";
export { default as Reclamos } from "./Reclamos/index.js";
export { default as Provincias } from "./Provincias/index.js";
export { default as Rubros } from "./Rubros/index.js";
export { default as Etiquetas_x_Fallos } from "./Etiquetas_x_Fallo/index.js";
export { default as Etiquetas } from "./Etiquetas/index.js";
export { default as Fallos_Archivos } from "./Fallos_Archivos/index.js";
export { default as Reclamos_x_Fallo } from "./Reclamos_x_Fallo/index.js";
export { default as Rubros_x_Fallos } from "./Rubros_x_Fallos/index.js";
export { default as Usuarios } from "./Usuarios/index.js";
export { default as Roles } from "./Roles/index.js";
export { default as Usuario_Rol } from "./Usuarios_Roles/index.js";
export { default as Divisas } from "./Divisas/index.js";
export { default as Profesiones } from "./Profesiones/index.js";
export { default as Profesiones_Usuarios } from "./Profiones_Usuarios/index.js";

Usuarios.belongsToMany(Roles, {
  through: Usuario_Rol,
  foreignKey: "idUsuario",
});
Roles.belongsToMany(Usuarios, { through: Usuario_Rol, foreignKey: "idRol" });
Fallos.belongsToMany(Empresas, {
  as: "EmpresasPorActor",
  through: Fallo_x_Actor,
  foreignKey: "idFallo",
});

Empresas.belongsToMany(Fallos, {
  as: "FallosPorActor",
  through: Fallo_x_Actor,
  foreignKey: "idEmpresa",
});

Empresas.belongsToMany(Fallos, {
  as: "FallosPorEmpresa",
  through: Fallo_x_Empresa,
  foreignKey: "idEmpresa",
});

Fallos.belongsToMany(Empresas, {
  as: "EmpresasPorFallo",
  through: Fallo_x_Empresa,
  foreignKey: "idFallo",
});

Usuarios.belongsToMany(Profesiones, {
  through: Profesiones_Usuarios,
  foreignKey: "idUsuario",
});
Profesiones.belongsToMany(Usuarios, {
  through: Profesiones_Usuarios,
  foreignKey: "idProfesion",
});
