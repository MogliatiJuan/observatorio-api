import { compareSync, hash } from "bcrypt";
import { Profesiones, Roles, Usuarios } from "../../models/index.js";
import {
  errorHandler,
  constants,
  typesDTO,
  validPasswordRegex,
} from "../../constants/index.js";
import {
  catchHandler,
  generateToken,
  createRandomPassword,
} from "../../utils/index.js";
import { UserDTO } from "../../dto/index.js";

export const createUser = async (req, res) => {
  try {
    const {
      matricula = null,
      nombre,
      apellido,
      email,
      idRol = [],
      domicilioElectronico = null,
      telefono = null,
      profesion = [],
      password,
    } = req.body;
    if (!nombre || !apellido || !email || !password)
      throw errorHandler.VAL_ERROR_EMPTY_VALUES;

    const validPassword = validPasswordRegex.test(password);
    if (!validPassword)
      throw {
        ...errorHandler.VAL_ERROR_WRONG_VALUES,
        details: errorHandler.MESSAGES.invalid_password,
      };
    const hashedPassword = await hash(password, constants.SALTROUNDS);

    const user = await Usuarios.create({
      matricula,
      nombre,
      apellido,
      email,
      domicilioElectronico,
      telefono,
      profesion,
      password: hashedPassword,
    });

    await user.addProfesiones(profesion);
    await user.addRoles(idRol);
    const newUser = new UserDTO(user, typesDTO.CREATE);

    res.status(201).send({ ...newUser, password: password });
  } catch (error) {
    catchHandler(error, res);
  }
};

export const getUser = async (req, res) => {
  try {
    const { id = null } = req.query;

    if (id) {
      const user = await Usuarios.findByPk(id);
      if (!user) throw errorHandler.DATA_NOT_FOUND;
      return res.send(new UserDTO(user));
    }

    const users = await Usuarios.findAll();
    const formattedUsers = users.map((u) => new UserDTO(u));

    res.send(formattedUsers);
  } catch (error) {
    catchHandler(error, res);
  }
};

export const disableOrEnableUser = async (req, res) => {
  try {
    const { id } = req.query;
    const user = await Usuarios.findByPk(id, { paranoid: false });
    if (!user) throw errorHandler.DATA_NOT_FOUND;

    if (user.deletedAt) {
      await user.restore();
      return res.send({ message: "Usuario activado" });
    }

    await user.destroy();
    res.send({ message: "Usuario desactivado" });
  } catch (error) {
    catchHandler(error, res);
  }
};

export const createRol = async (req, res) => {
  try {
    const { rol } = req.body;
    if (!rol) throw errorHandler.VAL_ERROR_EMPTY_VALUES;

    const newRol = await Roles.create({ nombre: rol });

    res.status(201).send(newRol);
  } catch (error) {
    catchHandler(error, res);
  }
};

export const deleteRol = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) throw errorHandler.VAL_ERROR_ID;

    const deletedRol = await Roles.destroy({ where: { id } });
    if (deletedRol != 1) throw errorHandler.DATA_NOT_FOUND;
    res.send({ message: "Rol eliminado" });
  } catch (error) {
    catchHandler(error, res);
  }
};

export const setRol = async (req, res) => {
  try {
    const { id } = req.query;
    const { idRol = [] } = req.body;
    const user = await Usuarios.findByPk(id, { include: Roles });

    if (!user) throw errorHandler.DATA_NOT_FOUND;

    const rolesToDelete = user.roles.map((r) => r.id);
    await user.removeRoles(rolesToDelete);
    await user.addRoles(idRol);

    const usermodified = await Usuarios.findByPk(id, { include: Roles });

    res.send(new UserDTO(usermodified, typesDTO.UPDATE));
  } catch (error) {
    catchHandler(error, res);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) throw errorHandler.VAL_ERROR_EMPTY_VALUES;

    const user = await Usuarios.findOne({ where: { email }, include: Roles });
    if (!user) throw errorHandler.DATA_NOT_FOUND;

    const isValidPassword = compareSync(password, user.password);
    if (!isValidPassword) throw errorHandler.VAL_ERROR_AUTH_USER;

    const token = generateToken(new UserDTO(user, typesDTO.UPDATE));

    return res.send({ token });
  } catch (error) {
    catchHandler(error, res);
  }
};

export const createProfession = async (req, res) => {
  try {
    const { profesion } = req.body;
    const newProfession = await Profesiones.create({ profesion });
    res.send(newProfession);
  } catch (error) {
    catchHandler(error, res);
  }
};

export const getProfessions = async (req, res) => {
  try {
    const { id = null } = req.query;

    if (!id) {
      const professions = await Profesiones.findAll();
      return res.send(professions);
    }

    const profession = await Profesiones.findByPk(id);
    res.send(profession);
  } catch (error) {
    catchHandler(error, res);
  }
};

export const deleteProfession = async (req, res) => {
  try {
    const { id } = req.query;
    const deletedProfession = await Profesiones.destroy({ where: { id } });
    if (deletedProfession != 1) throw errorHandler.DATA_NOT_FOUND;
    res.send({ message: "Profesión eliminada" });
  } catch (error) {
    catchHandler(error, res);
  }
};

export const modifyProfession = async (req, res) => {
  try {
    const { id, profesion } = req.body;
    const modifiedProfession = await Profesiones.update(
      { profesion },
      { where: { id } }
    );
    if (modifiedProfession != 1) throw errorHandler.DATA_NOT_FOUND;
    const profession = await Profesiones.findByPk(id);
    res.send(profession);
  } catch (error) {
    catchHandler(error, res);
  }
};
