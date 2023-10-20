import { capitalizeFirstLetter } from "../../utils/index.js";

export class CreateVeredictDTO {
  constructor(data) {
    this.agent = data.actor || null;
    this.tipojuicio = data.tipoJuicio || null;
    this.causas = data.causas || null;
    this.rubro = data.rubro || null;
    this.fecha = data.fecha || null;
    this.tribunalid = data.idTribunal || null;
    this.tribunal = data.tribunal || null;
    this.punitive = data.punitivo || null;
    this.moral = data.moral || null;
    this.patrimonial = data.patrimonial || null;
    this.summary = data.resumen || null;
  }
}

export class summaryVeredictDTO {
  constructor(data) {
    this.nroExpediente = data.id || null;
    this.actor = capitalizeFirstLetter(data.agent) || null;
    this.demandado = [];
    data.Empresas.forEach((empresa) => {
      this.demandado.push({
        razon_social: empresa.razon_social,
        cuit: empresa.cuit,
      });
    });
    this.tipoJuicio =
      capitalizeFirstLetter(data.Tipo_Juicio.description) || null;
    this.juzgado = capitalizeFirstLetter(data.Juzgado.nombre) || null;
    this.rubro = capitalizeFirstLetter(data.Rubro.rubro) || null;
    this.fecha = data.fecha || null;
    this.punitivo = data.punitive || null;
    this.moral = data.moral || null;
    this.patrimonial = data.patrimonial || null;
    this.resumen = capitalizeFirstLetter(data.summary) || null;
    this.causas = [];
    data.Reclamos.forEach((rec) => {
      this.causas.push(capitalizeFirstLetter(rec.description));
    });
    this.etiquetas = [];
    data.Etiquetas.forEach((tag) => {
      this.etiquetas.push(capitalizeFirstLetter(tag.description));
    });
    this.files = [];
    data.Fallos_Archivos.forEach((file) => {
      this.files.push({ file: file.filename, url: file.url });
    });
  }
}
