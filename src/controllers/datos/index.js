import {
  Ciudades,
  Departamentos,
  Juzgados,
  Provincias,
} from "../../models/index.js";

export const getAll = async (req, res) => {
  const {
    idProvincia = null,
    idDepartamento = null,
    idCiudad = null,
  } = req.query;

  if (!idProvincia && !idDepartamento && !idCiudad) {
    const provinces = await Provincias.findAll();
    return res.send(provinces);
  }
  if (!idDepartamento && !idCiudad && idProvincia) {
    const departments = await Departamentos.findAll({
      where: { id_provincia: idProvincia },
    });

    const cities = await Ciudades.findAll({
      where: { idprovincia: idProvincia },
    });
    return res.send({ departments, cities });
  }

  if (idCiudad && idDepartamento) {
    const tribunal = await Juzgados.findAll({
      where: { id_departamento: idDepartamento, id_ciudad: idCiudad },
    });
    return res.send(tribunal);
  } else {
    return res.status(400).send({
      error: "Falta enviar algún dato relacionado a ciudad o departamento",
    });
  }
};

export const getCities = async (req, res) => {
  try {
    const { idProvincia = null } = req.query;
    const conditions = {};

    idProvincia && (conditions.idprovincia = idProvincia);
    const cities = await Ciudades.findAll({
      where: conditions,
    });

    res.send(cities);
  } catch (error) {
    res.send(error);
  }
};

export const getProvinces = async (req, res) => {
  try {
    const provinces = await Provincias.findAll();

    res.send(provinces);
  } catch (error) {
    res.send(error);
  }
};

export const getDepartments = async (req, res) => {
  try {
    const { idProvincia = null } = req.query;
    const conditions = {};

    idProvincia && (conditions.id_provincia = idProvincia);
    const departments = await Departamentos.findAll({
      where: conditions,
    });

    res.send(departments);
  } catch (error) {
    res.send(error);
  }
};

export const getTribunals = async (req, res) => {
  try {
    const { idDepartamento = null, idCiudad = null } = req.query;
    const conditions = {};

    idDepartamento && (conditions.id_departamento = idDepartamento);
    idCiudad && (conditions.id_ciudad = idCiudad);

    const tribunals = await Juzgados.findAll({ where: conditions });

    res.send(tribunals);
  } catch (error) {
    res.send(error);
  }
};
