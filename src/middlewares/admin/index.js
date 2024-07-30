import jwt from "jsonwebtoken";
import { constants } from "../../constants/index.js";
import config from "../../config/index.js";

const adminMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Acceso no autorizado: Token faltante" });
  }

  try {
    const decoded = jwt.verify(token, config.SECRET_KEY);
    const { rol: roles } = decoded;

    if (!roles.some((role) => role.rol === constants.ADMIN)) {
      return res
        .status(403)
        .json({ message: "Acceso prohibido: Rol no autorizado" });
    }

    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Acceso no autorizado: Token inválido o expirado" });
  }
};

export default adminMiddleware;
