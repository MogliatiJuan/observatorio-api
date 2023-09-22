import { errorHandler } from "../../constants/index.js";
import { CreateVeredictDTO, summaryVeredictDTO } from "../../dto/index.js";
import {
  Empresas,
  Etiquetas,
  Etiquetas_x_Fallos,
  Fallo_x_Empresa,
  Fallos,
  Juzgados,
  Reclamos,
  Rubros,
  Tipo_Juicio,
} from "../../models/index.js";
import { catchHandler } from "../../utils/index.js";

export const veredictById = async (req, res) => {
  try {
    const { id } = req.params;
    let file;

    try {
      file = await Fallos.findByPk(id, {
        include: [Juzgados, Tipo_Juicio, Reclamos, Rubros, Empresas, Etiquetas],
      });
    } catch (error) {
      throw { ...errorHandler.DATABASE, details: error?.message };
    }

    if (!file) {
      return res.send([]);
    }
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
        include: [Juzgados, Tipo_Juicio, Reclamos, Rubros, Empresas, Etiquetas],
      });
    } catch (error) {
      throw { ...errorHandler.DATABASE, details: error?.message };
    }

    filesFiltered.forEach((file) => {
      filesFormatted.push(new summaryVeredictDTO(file.dataValues));
    });

    res.send(filesFormatted);
  } catch (error) {
    catchHandler(error, res);
  }
};

export const createVeredict = async (req, res) => {
  try {
    const { demandado = [], etiquetas = [] } = req.body;
    let veredictCreated, falloConEmpresas;

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
      falloConEmpresas = await Fallos.findByPk(veredictCreated.id, {
        include: [Juzgados, Tipo_Juicio, Reclamos, Rubros, Empresas, Etiquetas],
      });
    } catch (error) {
      throw { ...errorHandler.DATABASE, details: error?.message };
    }

    res.send(new summaryVeredictDTO(falloConEmpresas));
  } catch (error) {
    catchHandler(error, res);
  }
};
