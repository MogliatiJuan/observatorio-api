import { Readable } from "stream";
import {
  errorHandler,
  ftpStaticFolderUrl,
  mimetypePdf,
  sizeBytes,
} from "../../constants/index.js";
import { CreateVeredictDTO, summaryVeredictDTO } from "../../dto/index.js";
import {
  Ciudades,
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
import ftp from "basic-ftp";
import config from "../../config/index.js";
import sharp from "sharp";
import moment from "moment/moment.js";
import { Op } from "sequelize";

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
    fecha && (conditions.fecha = moment(fecha, "DD-MM-YYYY"));
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
    console.log("error->", error);
    catchHandler(error, res);
  } finally {
    client.close();
  }
};
