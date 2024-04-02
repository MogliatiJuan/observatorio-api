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
          Empresas,
          Etiquetas,
          Fallos_Archivos,
          Divisas,
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
      actor,
      rubro = null,
      demandado = null,
      fecha,
      etiquetas = null,
      tipoJuicio,
      causas = null,
      idTribunal,
      page = 1,
      offset = 10,
    } = req.query;

    const conditions = {};

    actor && (conditions.agent = { [Op.like]: `%${actor}%` });
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
        where: demandado && { id: demandado },
      },
      {
        model: Etiquetas,
        where: etiquetas && { id: etiquetas },
      },
      Fallos_Archivos,
      Divisas,
    ];

    //pagination
    const filesFiltered = await Fallos.findAndCountAll({
      limit: +offset,
      offset: (+page - 1) * +offset,
      where: conditions,
      include,
      distinct: true,
      order: [["fecha", "DESC"]],
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
    let { demandado = [], etiquetas = [], causas = [], rubro = [] } = req.body;
    let veredictCreated,
      falloConEmpresas,
      data = {};

    if (!Array.isArray(demandado)) {
      demandado = [demandado];
    }

    if (!Array.isArray(etiquetas)) {
      etiquetas = [etiquetas];
    }

    if (!Array.isArray(causas)) {
      causas = [causas];
    }

    if (!Array.isArray(rubro)) {
      rubro = [rubro];
    }

    const newVeredict = new CreateVeredictDTO(req.body);
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

    if (demandado.length >= 1) {
      try {
        await Promise.all(
          demandado.map(async (id) => {
            await Fallo_x_Empresa.create({
              idFallo: veredictCreated.id,
              idEmpresa: id,
            });
          })
        );
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
          Empresas,
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
    let demandado, causas, etiquetas, rubro;

    const record = await getFallosById(id);

    //convierte en array todo para tratarlo siempre igual
    if (!Array.isArray(req.body.demandado)) {
      req.body.demandado = [req.body.demandado];
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

    const changes = compareObjects(req.body, new compareDTO(record));

    if (noChangesDetected(changes, req.files)) {
      throw new Error(
        "No se han detectado cambios en la información a actualizar"
      );
    }

    const veredictData = processChanges(changes, new compareDTO(record));

    //logica para borrar y crear los nuevos valores
    if (!Array.isArray(changes.demandado)) {
      demandado = [changes.demandado];
    } else {
      demandado = changes.demandado;
    }
    if (changes.demandado && demandado.length >= 1) {
      try {
        await Fallo_x_Empresa.destroy({
          where: {
            idFallo: id,
          },
        });
        await Promise.all(
          demandado.map(async (idD) => {
            await Fallo_x_Empresa.create({
              idFallo: id,
              idEmpresa: idD,
            });
          })
        );
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
