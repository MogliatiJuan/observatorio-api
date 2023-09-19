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
    this.actor = data.agent || null;
    this.demandado = [];
    data.Empresas.forEach((empresa) => {
      this.demandado.push({
        razon_social: empresa.razon_social,
        cuit: empresa.cuit,
      });
    });
    this.tipoJuicio = data.Tipo_Juicio.description || null;
    this.causas = data.Reclamo.description || null;
    this.juzgado = data.Juzgado.nombre || null;
    this.rubro = data.Rubro.rubro || null;
    this.fecha = data.fecha || null;
    this.punitivo = data.punitive || null;
    this.moral = data.moral || null;
    this.patrimonial = data.patrimonial || null;
    this.resumen = data.summary || null;
    this.etiquetas = [];
    data.Etiquetas.forEach((tag) => {
      this.etiquetas.push(tag.descriptionah);
    });
  }
}
