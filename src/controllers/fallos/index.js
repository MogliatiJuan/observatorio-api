import { summaryVeredictDTO } from "../../dto/fallo/index.js";
import { CreateVeredictDTO } from "../../dto/index.js";
import Juzgados from "../../models/Juzgados/index.js";
import {
  Empresas,
  Etiquetas,
  Etiquetas_x_Fallos,
  Fallo_x_Empresa,
  Fallos,
  Reclamos,
  Rubros,
  Tipo_Juicio,
} from "../../models/index.js";

export const veredictById = async (req, res) => {
  try {
    const { id } = req.params;
    const file = await Fallos.findByPk(id, {
      include: [Juzgados, Tipo_Juicio, Reclamos, Rubros, Empresas, Etiquetas],
    });
    if (!file) {
      return res.send([]);
    }
    res.send(new summaryVeredictDTO(file));
  } catch (error) {
    res.send(error);
  }
};

export const veredictsAllOrFiltered = async (req, res) => {
  try {
    const { actor, demandado, rubro } = req.query;
    const conditions = {};
    const filesFormatted = [];

    actor && (conditions.agent = actor);

    //reveer con nueva forma de traer los datos
    //demandado && (conditions.defendant = demandado);
    //rubro && (conditions.rubro = rubro);

    const filesFiltered = await Fallos.findAll({
      where: conditions,
      include: [Juzgados, Tipo_Juicio, Reclamos, Rubros, Empresas, Etiquetas],
    });

    filesFiltered.forEach((file) => {
      filesFormatted.push(new summaryVeredictDTO(file.dataValues));
    });

    res.send(filesFormatted);
  } catch (error) {
    res.send(error);
  }
};

export const createVeredict = async (req, res) => {
  try {
    const { demandado = [], etiquetas = [] } = req.body;

    const newVeredict = new CreateVeredictDTO(req.body);
    const veredictCreated = await Fallos.create(newVeredict);

    if (demandado.length >= 1) {
      await Promise.all(
        demandado.map(async (id) => {
          await Fallo_x_Empresa.create({
            idFallo: veredictCreated.id,
            idEmpresa: id,
          });
        })
      );
    }

    if (etiquetas.length >= 1) {
      await Promise.all(
        etiquetas.map(async (tagId) => {
          await Etiquetas_x_Fallos.create({
            idFallo: veredictCreated.id,
            idTags: tagId,
          });
        })
      );
    }

    const falloConEmpresas = await Fallos.findByPk(veredictCreated.id, {
      include: [Juzgados, Tipo_Juicio, Reclamos, Rubros, Empresas, Etiquetas],
    });

    res.send(new summaryVeredictDTO(falloConEmpresas));
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};
