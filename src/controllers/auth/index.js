import { hash } from "bcrypt";
import { Roles, Usuarios } from "../../models/index.js";
import { errorHandler, constants, typesDTO } from "../../constants/index.js";
import { catchHandler } from "../../utils/index.js";
import createRandomPassword from "../../utils/randomString/index.js";
import { UserDTO } from "../../dto/index.js";

export const createUser = async (req, res) => {
  try {
    const { matricula, nombre, apellido, email, dni, idRol = [] } = req.body;
    if (!matricula || !nombre || !apellido || !email || !dni)
      throw errorHandler.VAL_ERROR_EMPTY_VALUES;

    const password = createRandomPassword(8);

    const hashedPassword = await hash(password, constants.SALTROUNDS);

    const user = await Usuarios.create({
      matricula,
      nombre,
      apellido,
      email,
      dni,
      password: hashedPassword,
    });

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
