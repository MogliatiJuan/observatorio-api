import moment from "moment";
import { capitalizeFirstLetter } from "../../utils/index.js";

export class CreateVeredictDTO {
  constructor(data) {
    this.agent = data.actor || null;
    this.tipojuicio = data.tipoJuicio || null;
    this.fecha = data.fecha || null;
    this.tribunalid = data.idTribunal || null;
    this.punitive = data.punitivo || null;
    this.moral = data.moral || null;
    this.patrimonial = data.patrimonial || null;
    this.summary = data.resumen || null;
  }
}

export class summaryVeredictDTO {
  constructor(data) {
    this.nroExpediente = data?.id || null;
    this.actor = capitalizeFirstLetter(data?.agent) || null;
    this.demandado = [];
    data.Empresas.forEach((empresa) => {
      this.demandado.push({
        razon_social: empresa?.razon_social,
        cuit: empresa?.cuit,
      });
    });
    this.tipoJuicio =
      capitalizeFirstLetter(data?.Tipo_Juicio?.description) || null;
    this.Ciudad = capitalizeFirstLetter(data?.Juzgado?.Ciudade?.nombre) || null;
    this.Provincia =
      capitalizeFirstLetter(data?.Juzgado?.Ciudade?.Provincia?.nombre) || null;
    this.juzgado = capitalizeFirstLetter(data?.Juzgado?.nombre) || null;
    this.fecha = moment(data?.fecha).format("DD/MM/YYYY") || null;
    this.punitivo = data?.punitive || null;
    this.moral = data?.moral || null;
    this.patrimonial = data?.patrimonial || null;
    this.resumen = data?.summary || null;
    this.rubro = [];
    data?.Rubros.forEach((rub) => {
      this.rubro.push(capitalizeFirstLetter(rub?.rubro));
    });
    this.causas = [];
    data?.Reclamos.forEach((rec) => {
      this.causas.push(capitalizeFirstLetter(rec?.description));
    });
    this.etiquetas = [];
    data?.Etiquetas.forEach((tag) => {
      this.etiquetas.push(capitalizeFirstLetter(tag?.description));
    });
    this.files = [];
    data?.Fallos_Archivos.forEach((file) => {
      this.files.push({ file: file?.filename, url: file?.url });
    });
  }
}
