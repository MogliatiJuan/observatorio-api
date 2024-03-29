import { constants } from "../../constants/index.js";

const adminMiddleware = (req, res, next) => {
  const { rol } = req.usuario;

  if (rol !== constants.ADMIN || !rol) {
    return res.status(403).json({ message: "Acceso no autorizado." });
  }

  next();
};
export default adminMiddleware;
