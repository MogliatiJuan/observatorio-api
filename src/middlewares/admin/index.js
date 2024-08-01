import jwt from "jsonwebtoken";
import { constants } from "../../constants/index.js";
import config from "../../config/index.js";

const adminMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      status: 401,
      code: "UNAUTHORIZED",
      message: "Acceso no autorizado: Token faltante",
      details: null,
    });
  }

  try {
    const decoded = jwt.verify(token, config.SECRET_KEY);
    const { rol: roles } = decoded;

    if (!roles.some((role) => role.rol === constants.ADMIN)) {
      return res.status(403).json({
        status: 403,
        code: "FORBIDDEN",
        message: "Acceso prohibido: Rol no autorizado",
        details: null,
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      status: 401,
      code: "UNAUTHORIZED",
      message: "Acceso no autorizado: Token inválido o expirado",
      details: null,
    });
  }
};

export default adminMiddleware;
