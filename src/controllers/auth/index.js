import { hash } from "bcrypt";
import { Usuarios } from "../../models/index.js";
import { errorHandler, constants } from "../../constants/index.js";
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
    const newUser = new UserDTO(user);

    res.status(201).send({ ...newUser, password: password });
  } catch (error) {
    catchHandler(error, res);
  }
};

export const getUser = async (req, res) => {
  try {
  } catch (error) {}
};

export const disableOrEnableUser = async (req, res) => {
  try {
  } catch (error) {}
};

export const createRol = async (req, res) => {
  try {
  } catch (error) {}
};

export const setRol = async (req, res) => {
  //need to pass the roles that user'll have
  try {
  } catch (error) {}
};
