import { CreateVeredictDTO } from "../../dto/index.js";
import { Empresas, Fallo_x_Empresa, Fallos } from "../../models/index.js";

export const veredictById = async (req, res) => {
  try {
    const { id } = req.params;
    const file = await Fallos.findByPk(id, { include: Empresas });
    if (!file) {
      return res.send([]);
    }
    res.send(file);
  } catch (error) {
    res.send(error);
  }
};

export const veredictsAllOrFiltered = async (req, res) => {
  try {
    const { actor, demandado, rubro } = req.query;
    const conditions = {};

    actor && (conditions.agent = actor);
    demandado && (conditions.defendant = demandado);
    rubro && (conditions.rubro = rubro);

    const filesFiltered = await Fallos.findAll({
      where: conditions,
    });

    res.send(filesFiltered);
  } catch (error) {
    res.send(error);
  }
};

export const createVeredict = async (req, res) => {
  try {
    const { idEmpresa = [] } = req.body;

    const newVeredict = new CreateVeredictDTO(req.body);
    const veredictCreated = await Fallos.create(newVeredict);

    if (idEmpresa.length >= 1) {
      await Promise.all(
        idEmpresa.map(async (id) => {
          await Fallo_x_Empresa.create({
            idFallo: veredictCreated.id,
            idEmpresa: id,
          });
        })
      );
    }

    const falloConEmpresas = await Fallos.findByPk(veredictCreated.id, {
      include: Empresas,
    });

    res.send(falloConEmpresas);
  } catch (error) {
    res.send(error);
  }
};
