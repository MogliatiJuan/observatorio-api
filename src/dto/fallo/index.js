import dayjs from "dayjs";
import { capitalizeFirstLetter } from "../../utils/index.js";

export class CreateVeredictDTO {
  constructor(data, firmDemandado, actorDemandado) {
    this.agent = actorDemandado ? null : data.actor || null;
    this.demandado = firmDemandado ? null : data.demandado || null;
    this.tipojuicio = data.tipoJuicio || null;
    this.fecha = data.fecha || null;
    this.tribunalid = data.idTribunal || null;
    this.punitive = data.punitivo || null;
    this.moral = data.moral || null;
    this.patrimonial = data.patrimonial || null;
    this.summary = data.resumen || null;
    this.idDivisa = data.divisa || null;
  }
}

export class summaryVeredictDTO {
  constructor(data) {
    this.nroExpediente = data?.id || null;
    this.actor = capitalizeFirstLetter(data?.agent) || null;
    this.demandado = capitalizeFirstLetter(data?.demandado) || null;
    this.demandadoActores = [];
    data.EmpresasPorActor.forEach((empresa) => {
      this.demandadoActores.push({
        id: empresa.id,
        razon_social: empresa?.razon_social,
        cuit: empresa?.cuit,
      });
    });
    this.demandadoEmpresas = [];
    data.EmpresasPorFallo.forEach((empresa) => {
      this.demandadoEmpresas.push({
        id: empresa.id,
        razon_social: empresa?.razon_social,
        cuit: empresa?.cuit,
      });
    });
    this.tipoJuicio = {
      id: data.Tipo_Juicio.id,
      nombre: capitalizeFirstLetter(data?.Tipo_Juicio?.description) || null,
    };
    this.ciudad = {
      id: data?.Juzgado?.Ciudade?.id || null,
      nombre: capitalizeFirstLetter(data?.Juzgado?.Ciudade?.nombre) || null,
    };
    this.provincia = {
      id: data?.Juzgado?.Ciudade?.Provincia?.id || null,
      nombre:
        capitalizeFirstLetter(data?.Juzgado?.Ciudade?.Provincia?.nombre) ||
        null,
    };
    this.juzgado = {
      id: data?.Juzgado?.id,
      nombre: capitalizeFirstLetter(data?.Juzgado?.nombre) || null,
    };
    this.fecha = dayjs(data?.fecha).format("DD/MM/YYYY") || null;
    this.punitivo = data?.punitive || null;
    this.moral = data?.moral || null;
    this.patrimonial = data?.patrimonial || null;
    this.divisa = {
      id: data.Divisa?.id || null,
      nombre: data.Divisa?.nombreDivisa || null,
      codigo: data.Divisa?.codigoDivisa || null,
    };
    this.resumen = data?.summary || null;
    this.rubro = [];
    data?.Rubros.forEach((rub) => {
      this.rubro.push({ id: rub.id, nombre: capitalizeFirstLetter(rub.rubro) });
    });
    this.causas = [];
    data?.Reclamos.forEach((rec) => {
      this.causas.push({
        id: rec.id,
        nombre: capitalizeFirstLetter(rec.description),
      });
    });
    this.etiquetas = [];
    data?.Etiquetas.forEach((tag) => {
      this.etiquetas.push({
        id: tag.id,
        nombre: capitalizeFirstLetter(tag.description),
      });
    });
    this.files = [];
    data?.Fallos_Archivos.forEach((file) => {
      this.files.push({ id: file.id, file: file?.filename, url: file?.url });
    });
    this.createdAt = dayjs(data.createdAt).isValid()
      ? dayjs(data.createdAt).format("DD/MM/YYYY")
      : null;
    this.updatedAt = dayjs(data.updatedAt).isValid()
      ? dayjs(data.updatedAt).format("DD/MM/YYYY")
      : null;
    this.deletedAt = dayjs(data.deletedAt).isValid()
      ? dayjs(data.deletedAt).format("DD/MM/YYYY")
      : null;
  }
}

export class compareDTO {
  constructor(data) {
    this.actor = capitalizeFirstLetter(data?.agent) || null;
    this.demandado = capitalizeFirstLetter(data?.demandado) || null;
    this.demandadoActores = [];
    data.EmpresasPorActor.forEach((empresa) => {
      this.demandadoActores.push({
        id: empresa.id,
        razon_social: empresa?.razon_social,
        cuit: empresa?.cuit,
      });
    });
    this.demandadoEmpresas = [];
    data.EmpresasPorFallo.forEach((empresa) => {
      this.demandadoEmpresas.push({
        id: empresa.id,
        razon_social: empresa?.razon_social,
        cuit: empresa?.cuit,
      });
    });
    this.tipoJuicio = data.Tipo_Juicio.id.toString();
    this.ciudad = data?.Juzgado?.Ciudade?.id.toString() || null;
    this.provincia = data?.Juzgado?.Ciudade?.Provincia?.id.toString() || null;
    this.juzgado = data?.Juzgado?.id.toString() || null;
    this.fecha = dayjs(data?.fecha).format("DD/MM/YYYY") || null;
    this.punitivo = data?.punitive || null;
    this.moral = data?.moral || null;
    this.patrimonial = data?.patrimonial || null;
    this.divisa = data.Divisa?.id.toString() || null;
    this.resumen = data?.summary || null;
    this.rubro = [];
    data?.Rubros.forEach((rub) => {
      this.rubro.push(rub.id.toString());
    });
    this.causas = [];
    data?.Reclamos.forEach((rec) => {
      this.causas.push(rec.id.toString());
    });
    this.etiquetas = [];
    data?.Etiquetas.forEach((tag) => {
      this.etiquetas.push(tag.id.toString());
    });
  }
}
