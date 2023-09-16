export class CreateVeredictDTO {
  constructor(data) {
    this.agent = data.actor;
    this.defendant = data.demandado;
    this.tipojuicio = data.tipoJuicio;
    this.causas = data.causas;
    this.rubro = data.rubro;
    this.fecha = data.fecha;
    this.tribunalid = data.idTribunal;
    this.tribunal = data.tribunal;
    this.punitive = data.punitivo;
    this.moral = data.moral;
    this.patrimonial = data.patrimonial;
    this.summary = data.resumen;
  }
}
