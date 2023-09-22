import { errorHandler } from "../../constants/index.js";
import {
  Ciudades,
  Departamentos,
  Juzgados,
  Provincias,
} from "../../models/index.js";

export const getAllSinceProvince = async (req, res) => {
  try {
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
      throw {
        ...errorHandler.VAL_ERROR_WRONG_VALUES,
        details: errorHandler.MESSAGES.tribunals_required,
      };
    }
  } catch (error) {
    catchHandler(error, res);
  }
};

export const getCities = async (req, res) => {
  try {
    const { idProvincia = null } = req.query;
    const conditions = {};
    let cities;

    idProvincia && (conditions.idprovincia = idProvincia);

    try {
      cities = await Ciudades.findAll({
        where: conditions,
      });
    } catch (error) {
      throw { ...errorHandler.DATABASE, details: error?.message };
    }

    res.send(cities);
  } catch (error) {
    catchHandler(error, res);
  }
};

export const getProvinces = async (req, res) => {
  try {
    let provinces;

    try {
      provinces = await Provincias.findAll();
    } catch (error) {
      throw { ...errorHandler.DATABASE, details: error?.message };
    }

    res.send(provinces);
  } catch (error) {
    catchHandler(error, res);
  }
};

export const getDepartments = async (req, res) => {
  try {
    const { idProvincia = null } = req.query;
    const conditions = {};
    let departments;

    idProvincia && (conditions.id_provincia = idProvincia);

    try {
      departments = await Departamentos.findAll({
        where: conditions,
      });
    } catch (error) {
      throw { ...errorHandler.DATABASE, details: error?.message };
    }

    res.send(departments);
  } catch (error) {
    catchHandler(error, res);
  }
};

export const getTribunals = async (req, res) => {
  try {
    const { idDepartamento = null, idCiudad = null } = req.query;
    const conditions = {};
    let tribunals;

    idDepartamento && (conditions.id_departamento = idDepartamento);
    idCiudad && (conditions.id_ciudad = idCiudad);

    try {
      tribunals = await Juzgados.findAll({ where: conditions });
    } catch (error) {
      throw { ...errorHandler.DATABASE, details: error?.message };
    }

    res.send(tribunals);
  } catch (error) {
    catchHandler(error, res);
  }
};
