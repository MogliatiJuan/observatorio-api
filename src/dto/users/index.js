import dayjs from "dayjs";
import { typesDTO } from "../../constants/index.js";

export class UserDTO {
  constructor(u, type = typesDTO.GET) {
    this.id = u.id || null;
    this.matricula = u.matricula || null;
    this.nombre = u.nombre || null;
    this.apellido = u.apellido || null;
    this.email = u.email || null;
    this.dni = u.dni || null;
    this.telefono = u.telefono || null;
    this.domicilioElectronico = u.domicilioElectronico || null;
    this.updatedAt = dayjs(u.updatedAt).format("DD/MM/YYYY HH:mm") || null;
    this.createdAt = dayjs(u.createdAt).format("DD/MM/YYYY HH:mm") || null;
    if (type === typesDTO.CREATE) {
      this.password = u.password || null;
    }
    if (type === typesDTO.UPDATE) {
      const roles = [];
      u.roles.map((r) =>
        roles.push({
          id: r.id,
          rol: r.nombre,
          createdAt: dayjs(r.usuario_rol.createdAt).format("DD/MM/YYYY HH:mm"),
        })
      );
      this.roles = roles;
    }
  }
}
