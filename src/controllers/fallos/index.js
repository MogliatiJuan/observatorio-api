import { Op } from "sequelize";
import { Readable } from "stream";
import sharp from "sharp";
import dayjs from "dayjs";
import ftp from "basic-ftp";
import customParseFormat from "dayjs/plugin/customParseFormat.js";
import {
  errorHandler,
  ftpStaticFolderUrl,
  mimetypePdf,
  sizeBytes,
} from "../../constants/index.js";
import {
  CreateVeredictDTO,
  compareDTO,
  summaryVeredictDTO,
} from "../../dto/index.js";
import {
  Ciudades,
  Divisas,
  Empresas,
  Etiquetas,
  Etiquetas_x_Fallos,
  Fallo_x_Actor,
  Fallo_x_Empresa,
  Fallos,
  Fallos_Archivos,
  Juzgados,
  Provincias,
  Reclamos,
  Reclamos_x_Fallo,
  Rubros,
  Rubros_x_Fallos,
  Tipo_Juicio,
} from "../../models/index.js";
import { catchHandler } from "../../utils/index.js";
import config from "../../config/index.js";
import {
  noChangesDetected,
  compareObjects,
  getFallosById,
  processChanges,
  updateRecord,
} from "../../utils/modifyVerdict/index.js";
import { isFirm } from "../../utils/isFirm.js";

dayjs.extend(customParseFormat);

export const veredictById = async (req, res) => {
  try {
    const { id } = req.params;
    let file;

    try {
      file = await Fallos.findByPk(id, {
        include: [
          {
            model: Juzgados,
            include: [{ model: Ciudades, include: [Provincias] }],
          },
          Tipo_Juicio,
          Reclamos,
          Rubros,
          Etiquetas,
          Fallos_Archivos,
          Divisas,
          {
            model: Empresas,
            as: "EmpresasPorFallo",
            through: { model: Fallo_x_Empresa, as: "FallosPorEmpresa" },
          },
          {
            model: Empresas,
            as: "EmpresasPorActor",
            through: { model: Fallo_x_Actor, as: "FallosPorActor" },
          },
        ],
      });
    } catch (error) {
      throw { ...errorHandler.DATABASE, details: error?.message };
    }
    if (!file) {
      return res.send([]);
    }
    file.Fallos_Archivos.forEach((fileFallo) => {
      fileFallo.url = `${ftpStaticFolderUrl}/observatorio/fallos/${file.id}/${fileFallo.filename}`;
    });
    res.send(new summaryVeredictDTO(file));
  } catch (error) {
    catchHandler(error, res);
  }
};

export const veredictsAllOrFiltered = async (req, res) => {
  try {
    const {
      actor = null,
      rubro = null,
      demandado = null,
      demandadoEmpresas = null,
      actorEmpresas = null,
      fecha,
      etiquetas = null,
      tipoJuicio,
      causas = null,
      idTribunal,
      page = 1,
      offset = 10,
    } = req.query;

    const paranoid = req.query.paranoid === "false" ? false : true;

    const conditions = {};

    actor && (conditions.agent = { [Op.like]: `%${actor}%` });
    demandado && (conditions.demandado = { [Op.like]: `%${demandado}%` });
    fecha && (conditions.fecha = fecha);
    tipoJuicio && (conditions.tipojuicio = tipoJuicio);
    idTribunal && (conditions.tribunalid = parseInt(idTribunal));
    const include = [
      Juzgados,
      Tipo_Juicio,
      { model: Reclamos, where: causas && { id: causas } },
      { model: Rubros, where: rubro && { id: rubro } },
      {
        model: Empresas,
        as: "EmpresasPorFallo",
        through: { model: Fallo_x_Empresa, as: "FallosPorEmpresa" },
        where: demandadoEmpresas && { id: demandadoEmpresas },
      },
      {
        model: Empresas,
        as: "EmpresasPorActor",
        through: { model: Fallo_x_Actor, as: "FallosPorActor" },
        where: actorEmpresas && { id: actorEmpresas },
      },
      {
        model: Etiquetas,
        where: etiquetas && { id: etiquetas },
      },
      Fallos_Archivos,
      Divisas,
    ];

    //pagination
    const filesFiltered = paranoid
      ? await Fallos.findAndCountAll({
          limit: +offset,
          offset: (+page - 1) * +offset,
          where: conditions,
          include,
          distinct: true,
          order: [["fecha", "DESC"]],
        })
      : await Fallos.findAndCountAll({
          limit: +offset,
          offset: (+page - 1) * +offset,
          where: { deletedAt: { [Op.ne]: null } },
          include,
          distinct: true,
          order: [["deletedAt", "DESC"]],
          paranoid,
        });

    const filesFormatted = filesFiltered.rows.map((file) => {
      if (file.Fallos_Archivos) {
        file.Fallos_Archivos.forEach((fileFallo) => {
          fileFallo.url = `${ftpStaticFolderUrl}/observatorio/fallos/${file.id}/${fileFallo.filename}`;
        });
      }
      return new summaryVeredictDTO(file.dataValues);
    });

    res.send({
      totalRows: filesFiltered.count,
      totalPages: Math.ceil(filesFiltered.count / +offset),
      currentPage: +page,
      data: filesFormatted,
    });
  } catch (error) {
    catchHandler(error, res);
  }
};

export const createVeredict = async (req, res) => {
  const client = new ftp.Client();
  client.ftp.verbose = true;
  try {
    let {
      demandado = [],
      etiquetas = [],
      causas = [],
      rubro = [],
      actor = [],
    } = req.body;
    let veredictCreated,
      falloConEmpresas,
      data = {};

    if (!Array.isArray(etiquetas)) {
      etiquetas = [etiquetas];
    }

    if (!Array.isArray(causas)) {
      causas = [causas];
    }

    if (!Array.isArray(rubro)) {
      rubro = [rubro];
    }

    const isFirmActor = isFirm(actor);
    const isFirmDemandado = isFirm(demandado);

    const newVeredict = new CreateVeredictDTO(
      req.body,
      isFirmDemandado,
      isFirmActor
    );
    for (const key in newVeredict) {
      if (newVeredict[key] !== undefined) {
        data[key] = newVeredict[key];
      }
      if (
        newVeredict[key] === "" ||
        newVeredict[key] == "undefined" ||
        newVeredict[key] == "null"
      ) {
        data[key] = null;
      }
    }

    try {
      veredictCreated = await Fallos.create(data);
    } catch (error) {
      throw { ...errorHandler.DATABASE_UPLOAD, details: error?.message };
    }

    if (isFirmDemandado) {
      try {
        if (!Array.isArray(demandado)) {
          await Fallo_x_Empresa.create({
            idFallo: veredictCreated.id,
            idEmpresa: demandado,
          });
        } else {
          await Promise.all(
            demandado.map(async (id) => {
              await Fallo_x_Empresa.create({
                idFallo: veredictCreated.id,
                idEmpresa: id,
              });
            })
          );
        }
      } catch (error) {
        throw { ...errorHandler.DATABASE_UPLOAD, details: error?.message };
      }
    }

    if (isFirmActor) {
      try {
        if (!Array.isArray(actor)) {
          await Fallo_x_Actor.create({
            idFallo: veredictCreated.id,
            idEmpresa: actor,
          });
        } else {
          await Promise.all(
            actor.map(async (id) => {
              await Fallo_x_Actor.create({
                idFallo: veredictCreated.id,
                idEmpresa: id,
              });
            })
          );
        }
      } catch (error) {
        throw { ...errorHandler.DATABASE_UPLOAD, details: error?.message };
      }
    }

    if (etiquetas.length >= 1) {
      try {
        await Promise.all(
          etiquetas.map(async (tagId) => {
            await Etiquetas_x_Fallos.create({
              idFallo: veredictCreated.id,
              idTags: tagId,
            });
          })
        );
      } catch (error) {
        throw { ...errorHandler.DATABASE_UPLOAD, details: error?.message };
      }
    }

    if (causas.length >= 1) {
      try {
        await Promise.all(
          causas.map(async (idCausa) => {
            await Reclamos_x_Fallo.create({
              idFallo: veredictCreated.id,
              idReclamo: idCausa,
            });
          })
        );
      } catch (error) {
        throw { ...errorHandler.DATABASE_UPLOAD, details: error?.message };
      }
    }

    if (rubro.length >= 1) {
      try {
        await Promise.all(
          rubro.map(async (idRubro) => {
            await Rubros_x_Fallos.create({
              idFallo: veredictCreated.id,
              idRubro: idRubro,
            });
          })
        );
      } catch (error) {
        throw { ...errorHandler.DATABASE_UPLOAD, details: error?.message };
      }
    }

    try {
      await client.access({
        host: config.FTP_HOST,
        user: config.FTP_USER,
        password: config.FTP_PASSWORD,
      });
    } catch (error) {
      throw { ...errorHandler.FTP, details: error?.message };
    }

    const basePath = `/public_html/images-observatorio/observatorio/fallos/${veredictCreated.id}`;

    try {
      await client.ensureDir(basePath);
    } catch (error) {
      throw { ...errorHandler.FTP_DIR, details: error?.message };
    }

    const files = Object.entries(req.files);

    for (let [_key, value] of files) {
      if (!Array.isArray(value)) {
        value = [value];
      }

      for (let file of value) {
        let buffer;
        if (file.size < sizeBytes || file.mimetype === mimetypePdf) {
          buffer = file.data;
        } else {
          buffer = await sharp(file.data)
            .resize(800, 800, { fit: "inside" })
            .sharpen()
            .toBuffer();
        }

        const readableStreamPoder = Readable.from(buffer);
        const filename = `${veredictCreated.id}_${Date.now()}.${
          file.name.split(".")[file.name.split(".").length - 1]
        }`;
        try {
          await client.uploadFrom(
            readableStreamPoder,
            `${basePath}/${filename}`
          );
        } catch (error) {
          throw { ...errorHandler.FTP_UPLOAD, details: error?.message };
        }

        try {
          await Fallos_Archivos.create({
            idFallo: veredictCreated.id,
            filename,
          });
        } catch (error) {
          throw { ...errorHandler.DATABASE, details: error?.message };
        }
      }
    }

    try {
      falloConEmpresas = await Fallos.findByPk(veredictCreated.id, {
        include: [
          Juzgados,
          Tipo_Juicio,
          Reclamos,
          Rubros,
          {
            model: Empresas,
            as: "EmpresasPorFallo",
            through: { model: Fallo_x_Empresa, as: "FallosPorEmpresa" },
          },
          {
            model: Empresas,
            as: "EmpresasPorActor",
            through: { model: Fallo_x_Actor, as: "FallosPorActor" },
          },
          Etiquetas,
          Fallos_Archivos,
        ],
      });
    } catch (error) {
      throw { ...errorHandler.DATABASE, details: error?.message };
    }

    falloConEmpresas.Fallos_Archivos.forEach((file) => {
      file.url = `${ftpStaticFolderUrl}/observatorio/fallos/${veredictCreated.id}/${file.filename}`;
    });

    res.send(new summaryVeredictDTO(falloConEmpresas));
  } catch (error) {
    catchHandler(error, res);
  } finally {
    client.close();
  }
};

export const modifyVeredict = async (req, res) => {
  const client = new ftp.Client();
  client.ftp.verbose = true;
  try {
    const { id } = req.params;
    let demandadoActores, demandadoEmpresas, causas, etiquetas, rubro;

    const record = await getFallosById(id);

    //convierte en array todo para tratarlo siempre igual
    if (!Array.isArray(req.body.demandadoActores)) {
      req.body.demandadoActores = [req.body.demandadoActores];
    }
    if (!Array.isArray(req.body.demandadoEmpresas)) {
      req.body.demandadoEmpresas = [req.body.demandadoEmpresas];
    }
    if (!Array.isArray(req.body.causas)) {
      req.body.causas = [req.body.causas];
    }
    if (!Array.isArray(req.body.etiquetas)) {
      req.body.etiquetas = [req.body.etiquetas];
    }
    if (!Array.isArray(req.body.rubro)) {
      req.body.rubro = [req.body.rubro];
    }
    //del front mando null en string y lo transformo
    if (req.body.ciudad === "null") req.body.ciudad = null;
    if (req.body.provincia === "null") req.body.provincia = null;
    if (req.body.juzgado === "null") req.body.juzgado = null;
    if (req.body.demandado === "null") req.body.demandado = null;
    if (req.body.actor === "null") req.body.actor = null;
    if (req.body.resumen.trim() === "" || req.body.resumen === "null")
      req.body.resumen = null;
    if (
      req.body.demandadoEmpresas.some((e) => e == "undefined" || e == undefined)
    ) {
      req.body.demandadoEmpresas = [];
    }
    if (
      req.body.demandadoActores.some((e) => e == "undefined" || e == undefined)
    ) {
      req.body.demandadoActores = [];
    }
    if (req.body.etiquetas.some((e) => e == "undefined" || e == undefined)) {
      req.body.etiquetas = [];
    }
    if (req.body.rubro.some((e) => e == "undefined" || e == undefined)) {
      req.body.rubro = [];
    }
    if (req.body.causas.some((e) => e == "undefined" || e == undefined)) {
      req.body.causas = [];
    }

    const changes = compareObjects(req.body, new compareDTO(record));
    if (noChangesDetected(changes, req.files))
      throw {
        ...errorHandler.VAL_NO_CHANGES_FOUND,
        details: errorHandler.MESSAGES.no_changes_found,
      };

    const veredictData = processChanges(changes, new compareDTO(record));
    //logica para borrar y crear los nuevos valores
    if (!Array.isArray(changes.demandadoActores)) {
      demandadoActores = [changes.demandadoActores];
    } else {
      demandadoActores = changes.demandadoActores;
    }
    if (changes.demandadoActores && demandadoActores.length >= 1) {
      try {
        await Fallo_x_Actor.destroy({
          where: {
            idFallo: id,
          },
        });
        await Promise.all(
          demandadoActores.map(async (idD) => {
            await Fallo_x_Actor.create({
              idFallo: id,
              idEmpresa: idD,
            });
          })
        );
      } catch (error) {
        throw { ...errorHandler.DATABASE_UPLOAD, details: error?.message };
      }
    } else if (demandadoActores.length === 0) {
      try {
        await Fallo_x_Actor.destroy({
          where: {
            idFallo: id,
          },
        });
      } catch (error) {
        throw { ...errorHandler.DATABASE_UPLOAD, details: error?.message };
      }
    }
    if (!Array.isArray(changes.demandadoEmpresas)) {
      demandadoEmpresas = [changes.demandadoEmpresas];
    } else {
      demandadoEmpresas = changes.demandadoEmpresas;
    }
    if (changes.demandadoEmpresas && demandadoEmpresas.length >= 1) {
      try {
        await Fallo_x_Empresa.destroy({
          where: {
            idFallo: id,
          },
        });
        await Promise.all(
          demandadoEmpresas.map(async (idD) => {
            await Fallo_x_Empresa.create({
              idFallo: id,
              idEmpresa: idD,
            });
          })
        );
      } catch (error) {
        throw { ...errorHandler.DATABASE_UPLOAD, details: error?.message };
      }
    } else if (demandadoEmpresas.length === 0) {
      try {
        await Fallo_x_Empresa.destroy({
          where: {
            idFallo: id,
          },
        });
      } catch (error) {
        throw { ...errorHandler.DATABASE_UPLOAD, details: error?.message };
      }
    }
    if (!Array.isArray(changes.causas)) {
      causas = [changes.causas];
    } else {
      causas = changes.causas;
    }
    if (changes.causas && causas.length >= 1) {
      try {
        await Reclamos_x_Fallo.destroy({
          where: {
            idFallo: id,
          },
        });
        await Promise.all(
          causas.map(async (idC) => {
            await Reclamos_x_Fallo.create({
              idFallo: id,
              idReclamo: idC,
            });
          })
        );
      } catch (error) {
        throw { ...errorHandler.DATABASE_UPLOAD, details: error?.message };
      }
    } else if (causas.length === 0) {
      try {
        await Reclamos_x_Fallo.destroy({
          where: {
            idFallo: id,
          },
        });
      } catch (error) {
        throw { ...errorHandler.DATABASE_UPLOAD, details: error?.message };
      }
    }
    if (!Array.isArray(changes.etiquetas)) {
      etiquetas = [changes.etiquetas];
    } else {
      etiquetas = changes.etiquetas;
    }
    if (changes.etiquetas && etiquetas.length >= 1) {
      try {
        await Etiquetas_x_Fallos.destroy({
          where: {
            idFallo: id,
          },
        });
        await Promise.all(
          etiquetas.map(async (idT) => {
            await Etiquetas_x_Fallos.create({
              idFallo: id,
              idTags: idT,
            });
          })
        );
      } catch (error) {
        throw { ...errorHandler.DATABASE_UPLOAD, details: error?.message };
      }
    } else if (etiquetas.length === 0) {
      try {
        await Etiquetas_x_Fallos.destroy({
          where: {
            idFallo: id,
          },
        });
      } catch (error) {
        throw { ...errorHandler.DATABASE_UPLOAD, details: error?.message };
      }
    }
    if (!Array.isArray(changes.rubro)) {
      rubro = [changes.rubro];
    } else {
      rubro = changes.rubro;
    }
    if (changes.rubro && rubro.length >= 1) {
      try {
        await Rubros_x_Fallos.destroy({
          where: {
            idFallo: id,
          },
        });
        await Promise.all(
          rubro.map(async (idR) => {
            await Rubros_x_Fallos.create({
              idFallo: id,
              idRubro: idR,
            });
          })
        );
      } catch (error) {
        throw { ...errorHandler.DATABASE_UPLOAD, details: error?.message };
      }
    } else if (rubro.length == 0) {
      try {
        await Rubros_x_Fallos.destroy({
          where: {
            idFallo: id,
          },
        });
      } catch (error) {
        throw { ...errorHandler.DATABASE_UPLOAD, details: error?.message };
      }
    }
    await updateRecord(record, veredictData);

    if (req.files) {
      const files = Object.entries(req.files);

      for (let [_key, value] of files) {
        if (!Array.isArray(value)) {
          value = [value];
        }

        for (let file of value) {
          let buffer;
          if (file.size < sizeBytes || file.mimetype === mimetypePdf) {
            buffer = file.data;
          } else {
            buffer = await sharp(file.data)
              .resize(800, 800, { fit: "inside" })
              .sharpen()
              .toBuffer();
          }

          const readableStreamPoder = Readable.from(buffer);
          const filename = `${id}_${Date.now()}.${
            file.name.split(".")[file.name.split(".").length - 1]
          }`;

          try {
            await client.access({
              host: config.FTP_HOST,
              user: config.FTP_USER,
              password: config.FTP_PASSWORD,
            });
          } catch (error) {
            throw { ...errorHandler.FTP, details: error?.message };
          }

          const basePath = `/public_html/images-observatorio/observatorio/fallos/${id}`;

          try {
            await client.ensureDir(basePath);
          } catch (error) {
            throw { ...errorHandler.FTP_DIR, details: error?.message };
          }
          try {
            await client.remove(
              `${basePath}/${record.Fallos_Archivos[0].filename}`
            );
            await client.uploadFrom(
              readableStreamPoder,
              `${basePath}/${filename}`
            );
          } catch (error) {
            throw { ...errorHandler.FTP_UPLOAD, details: error?.message };
          }

          try {
            await Fallos_Archivos.destroy({
              where: {
                idFallo: id,
              },
            });
            await Fallos_Archivos.create({
              idFallo: id,
              filename,
            });
          } catch (error) {
            throw { ...errorHandler.DATABASE, details: error?.message };
          }
        }
      }
    }
    const recordModified = await getFallosById(id);

    recordModified.Fallos_Archivos.forEach((file) => {
      file.url = `${ftpStaticFolderUrl}/observatorio/fallos/${id}/${file.filename}`;
    });

    res.send(new summaryVeredictDTO(recordModified));
  } catch (error) {
    catchHandler(error, res);
  } finally {
    client.close();
  }
};

export const deleteVeredict = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedVeredict = await Fallos.destroy({
      where: {
        id,
      },
    });
    if (!deletedVeredict) throw errorHandler.DATA_NOT_FOUND;

    res.send({ message: "Eliminado correctamente", isSuccess: true });
  } catch (error) {
    catchHandler(error, res);
  }
};

export const restoreVeredict = async (req, res) => {
  try {
    const { id } = req.params;
    const restoredVeredict = await Fallos.restore({
      where: {
        id,
      },
    });
    if (!restoredVeredict) throw errorHandler.DATA_NOT_FOUND;

    res.send({ message: "Restaurado correctamente", isSuccess: true });
  } catch (error) {
    catchHandler(error, res);
  }
};
