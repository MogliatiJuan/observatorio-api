import dayjs from "dayjs";

export class UserDTO {
  constructor(u) {
    this.matricula = u.matricula || null;
    this.nombre = u.nombre || null;
    this.apellido = u.apellido || null;
    this.email = u.email || null;
    this.dni = u.dni || null;
    this.password = u.password || null;
    this.updatedAt = dayjs(u.updatedAt).format("DD/MM/YYYY HH:mm") || null;
    this.createdAt = dayjs(u.createdAt).format("DD/MM/YYYY HH:mm") || null;
  }
}
