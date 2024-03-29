import jwt from "jsonwebtoken";
import config from "../../config/index.js";

const generateToken = ({ id, email, roles }) => {
  const payload = {
    id: id,
    email: email,
    rol: roles,
  };

  const secretKey = config.SECRET_KEY;
  const options = { expiresIn: "8h" };

  return jwt.sign(payload, secretKey, options);
};

export default generateToken;
