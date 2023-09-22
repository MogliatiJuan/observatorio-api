import { Readable } from "stream";
import {
  errorHandler,
  ftpStaticFolderUrl,
  mimetypePdf,
  sizeBytes,
} from "../../constants/index.js";
import { CreateVeredictDTO, summaryVeredictDTO } from "../../dto/index.js";
import {
  Empresas,
  Etiquetas,
  Etiquetas_x_Fallos,
  Fallo_x_Empresa,
  Fallos,
  Fallos_Archivos,
  Juzgados,
  Reclamos,
  Rubros,
  Tipo_Juicio,
} from "../../models/index.js";
import { catchHandler } from "../../utils/index.js";
import ftp from "basic-ftp";
import config from "../../config/index.js";
import sharp from "sharp";

export const veredictById = async (req, res) => {
  try {
    const { id } = req.params;
    let file;

    try {
      file = await Fallos.findByPk(id, {
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
    const { actor } = req.query;
    const filesFormatted = [],
      conditions = {};
    let filesFiltered;

    actor && (conditions.agent = actor);

    try {
      filesFiltered = await Fallos.findAll({
        where: conditions,
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

    filesFiltered.forEach((file) => {
      file.Fallos_Archivos &&
        file.Fallos_Archivos.forEach((fileFallo) => {
          fileFallo.url = `${ftpStaticFolderUrl}/observatorio/fallos/${file.id}/${fileFallo.filename}`;
        });
      filesFormatted.push(new summaryVeredictDTO(file.dataValues));
    });

    res.send(filesFormatted);
  } catch (error) {
    catchHandler(error, res);
  }
};

export const createVeredict = async (req, res) => {
  const client = new ftp.Client();
  client.ftp.verbose = true;
  try {
    let { demandado = [], etiquetas = [] } = req.body;
    let veredictCreated, falloConEmpresas, newFile;

    demandado = JSON.parse(req.body.demandado);
    etiquetas = JSON.parse(req.body.etiquetas);

    const newVeredict = new CreateVeredictDTO(req.body);

    try {
      veredictCreated = await Fallos.create(newVeredict);
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
          newFile = await Fallos_Archivos.create({
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
