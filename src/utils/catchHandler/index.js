export const catchHandler = (error, res) => {
  if (error.name === "SequelizeUniqueConstraintError") {
    return res.status(409).json({
      status: 409,
      code: "SEQUELIZE-UNIQUE-CONSTRAINT-ERROR",
      message: "El valor que se intenta enviar ya se encuentra registrado",
      details: {
        type: error?.parent?.code,
        message: error?.parent?.sqlMessage,
      },
    });
  } else {
    return res.status(error?.status || 400).json({
      status: error?.status || 400,
      code: error?.code || "BAD-REQUEST",
      message: error?.message || "Bad Request",
      details: error?.details || null,
    });
  }
};

export default catchHandler;
