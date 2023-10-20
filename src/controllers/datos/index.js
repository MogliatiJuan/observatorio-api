import { errorHandler } from "../../constants/index.js";
import {
  Ciudades,
  Departamentos,
  Empresas,
  Etiquetas,
  Juzgados,
  Provincias,
  Reclamos,
  Rubros,
  Tipo_Juicio,
} from "../../models/index.js";
import { catchHandler } from "../../utils/index.js";

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

export const getFactories = async (req, res) => {
  try {
    const { cuit = null } = req.query;

    if (!cuit) {
      const allFactories = await Empresas.findAll();
      return res.send(allFactories);
    } else {
      const factory = await Empresas.findOne({ where: { cuit: +cuit } });

      if (!factory) {
        throw {
          ...errorHandler.DATA_NOT_FOUND,
          details: errorHandler.MESSAGES.data_not_found,
        };
      }
      return res.send(factory);
    }
  } catch (error) {
    catchHandler(error, res);
  }
};

export const createFactory = async (req, res) => {
  try {
    const { razon_social, cuit } = req.body;
    let createdFactory;
    if (!razon_social || !cuit)
      throw {
        ...errorHandler.VAL_ERROR_EMPTY_VALUES,
        details: errorHandler.MESSAGES.factories_required,
      };
    try {
      createdFactory = await Empresas.create({ razon_social, cuit });
    } catch (error) {
      throw { ...errorHandler.DATABASE, details: error?.message };
    }
    res.send(createdFactory);
  } catch (error) {
    catchHandler(error, res);
  }
};

export const modifiyFactory = async (req, res) => {
  try {
    const { razon_social, cuit, direccion, servicio } = req.body;
    let { id } = req.params;
    let modifiedFactory;

    try {
      const [rowCount] = await Empresas.update(
        { razon_social, cuit, direccion, servicio },
        { where: { id } }
      );

      if (rowCount === 0) throw errorHandler.MESSAGES.data_not_found;

      modifiedFactory = await Empresas.findByPk(+id);
    } catch (error) {
      throw { ...errorHandler.DATABASE_UPLOAD, details: error };
    }
    res.send(modifiedFactory);
  } catch (error) {
    catchHandler(error, res);
  }
};

export const getTags = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      const allTags = await Etiquetas.findAll();
      return res.send(allTags);
    } else {
      const tag = await Etiquetas.findByPk(+id);
      return res.send(tag);
    }
  } catch (error) {
    catchHandler(error, res);
  }
};

export const createTags = async (req, res) => {
  try {
    const { description } = req.body;
    let createdTag;

    if (!description)
      throw {
        ...errorHandler.VAL_ERROR_EMPTY_VALUES,
        details: errorHandler.MESSAGES.description_required,
      };
    try {
      createdTag = await Etiquetas.create({
        description: description.toUpperCase(),
      });
    } catch (error) {
      throw { ...errorHandler.DATABASE, details: error?.message };
    }
    res.send(createdTag);
  } catch (error) {
    catchHandler(error, res);
  }
};

export const modifiyTags = async (req, res) => {
  try {
    const { description } = req.body;
    let { id } = req.params;
    let modifiedTag;

    try {
      const [rowCount] = await Etiquetas.update(
        { description },
        { where: { id } }
      );

      if (rowCount === 0) throw errorHandler.MESSAGES.data_not_found;

      modifiedTag = await Etiquetas.findByPk(+id);
    } catch (error) {
      throw { ...errorHandler.DATABASE_UPLOAD, details: error };
    }
    res.send(modifiedTag);
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

export const createTribunals = async (req, res) => {
  try {
    const { nombre, idDepartamento, idCiudad } = req.body;
    let createdTribunal;

    if (!nombre || !idDepartamento || !idCiudad)
      throw {
        ...errorHandler.VAL_ERROR_EMPTY_VALUES,
        details: errorHandler.MESSAGES.create_tribunal,
      };
    try {
      createdTribunal = await Juzgados.create({
        nombre,
        id_departamento: idDepartamento,
        id_ciudad: idCiudad,
      });
    } catch (error) {
      throw { ...errorHandler.DATABASE, details: error?.message };
    }
    res.send(createdTribunal);
  } catch (error) {
    catchHandler(error, res);
  }
};

export const modifiyTribunals = async (req, res) => {
  try {
    const { nombre, idDepartamento, idCiudad } = req.body;
    let { id } = req.params;
    let modifiedTag;

    try {
      const [rowCount] = await Juzgados.update(
        { nombre, idDepartamento, idCiudad },
        { where: { id } }
      );

      if (rowCount === 0) throw errorHandler.MESSAGES.data_not_found;

      modifiedTag = await Juzgados.findByPk(+id);
    } catch (error) {
      throw { ...errorHandler.DATABASE_UPLOAD, details: error };
    }
    res.send(modifiedTag);
  } catch (error) {
    catchHandler(error, res);
  }
};

export const getClaims = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      const allClaims = await Reclamos.findAll();
      return res.send(allClaims);
    } else {
      const claim = await Reclamos.findByPk(+id);
      return res.send(claim);
    }
  } catch (error) {
    catchHandler(error, res);
  }
};

export const createClaims = async (req, res) => {
  try {
    const { description } = req.body;
    let createdClaim;

    if (!description)
      throw {
        ...errorHandler.VAL_ERROR_EMPTY_VALUES,
        details: errorHandler.MESSAGES.description_required,
      };
    try {
      createdClaim = await Reclamos.create({
        description: description.toUpperCase(),
      });
    } catch (error) {
      throw { ...errorHandler.DATABASE, details: error?.message };
    }
    res.send(createdClaim);
  } catch (error) {
    catchHandler(error, res);
  }
};

export const modifiyClaims = async (req, res) => {
  try {
    const { description } = req.body;
    let { id } = req.params;
    let modifiedClaim;

    try {
      const [rowCount] = await Reclamos.update(
        { description },
        { where: { id } }
      );

      if (rowCount === 0) throw errorHandler.MESSAGES.data_not_found;

      modifiedClaim = await Reclamos.findByPk(+id);
    } catch (error) {
      throw { ...errorHandler.DATABASE_UPLOAD, details: error };
    }
    res.send(modifiedClaim);
  } catch (error) {
    catchHandler(error, res);
  }
};

export const getSector = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      const allSectors = await Rubros.findAll();
      return res.send(allSectors);
    } else {
      const sector = await Rubros.findByPk(+id);
      return res.send(sector);
    }
  } catch (error) {
    catchHandler(error, res);
  }
};

export const createSector = async (req, res) => {
  try {
    const { rubro } = req.body;
    let createdSector;

    if (!rubro)
      throw {
        ...errorHandler.VAL_ERROR_EMPTY_VALUES,
        details: errorHandler.MESSAGES.rubro_required,
      };
    try {
      createdSector = await Rubros.create({
        rubro: rubro.toUpperCase(),
      });
    } catch (error) {
      throw { ...errorHandler.DATABASE, details: error?.message };
    }
    res.send(createdSector);
  } catch (error) {
    catchHandler(error, res);
  }
};

export const modifiySector = async (req, res) => {
  try {
    const { rubro } = req.body;
    let { id } = req.params;
    let modifiedSector;

    try {
      const [rowCount] = await Rubros.update({ rubro }, { where: { id } });

      if (rowCount === 0) throw errorHandler.MESSAGES.data_not_found;

      modifiedSector = await Rubros.findByPk(+id);
    } catch (error) {
      throw { ...errorHandler.DATABASE_UPLOAD, details: error };
    }
    res.send(modifiedSector);
  } catch (error) {
    catchHandler(error, res);
  }
};

export const getTypeTrial = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      const allTypesTrials = await Tipo_Juicio.findAll();
      return res.send(allTypesTrials);
    } else {
      const TypeTrial = await Tipo_Juicio.findByPk(+id);
      return res.send(TypeTrial);
    }
  } catch (error) {
    catchHandler(error, res);
  }
};

export const createTypeTrial = async (req, res) => {
  try {
    const { description } = req.body;
    let createdSector;

    if (!description)
      throw {
        ...errorHandler.VAL_ERROR_EMPTY_VALUES,
        details: errorHandler.MESSAGES.description_required,
      };
    try {
      createdSector = await Tipo_Juicio.create({
        description: description.toUpperCase(),
      });
    } catch (error) {
      throw { ...errorHandler.DATABASE, details: error?.message };
    }
    res.send(createdSector);
  } catch (error) {
    catchHandler(error, res);
  }
};

export const modifiyTypeTrial = async (req, res) => {
  try {
    const { description } = req.body;
    let { id } = req.params;
    let modifiedTypeTrial;

    try {
      const [rowCount] = await Tipo_Juicio.update(
        { description },
        { where: { id } }
      );

      if (rowCount === 0) throw errorHandler.MESSAGES.data_not_found;

      modifiedTypeTrial = await Tipo_Juicio.findByPk(+id);
    } catch (error) {
      throw { ...errorHandler.DATABASE_UPLOAD, details: error };
    }
    res.send(modifiedTypeTrial);
  } catch (error) {
    catchHandler(error, res);
  }
};
