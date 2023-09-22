const errorHandler = {
  DATABASE: {
    status: 500,
    code: "INTERNAL-SERVER-ERROR-DATABASE",
    message: "Ocurrió un error al conectar con la base de datos",
  },
  DATABASE_UPLOAD: {
    status: 500,
    code: "INTERNAL-SERVER-ERROR-DATABASE-UPLOAD",
    message:
      "Ocurrió un error al intentar crear o, actualizar y guardar el nombre del archivo o dato",
  },
  FTP: {
    status: 500,
    code: "INTERNAL-SERVER-ERROR-FTP",
    message: "Ocurrió un error al conectar al servidor",
  },
  FTP_DIR: {
    status: 503,
    code: "INTERNAL-SERVER-ERROR-FTP-DIR",
    message: "Ocurrió un error al intentar abrir el directorio del servidor",
  },
  FTP_UPLOAD: {
    status: 502,
    code: "BAD-GATEWAY-FTP-UPLOAD",
    message: "Ocurrió un error al subir el archivo o removerlo",
  },
  DATA_NOT_FOUND: {
    status: 404,
    code: "NOT-FOUND-DATA",
    message:
      "No se encontró ningún registro o archivo con los datos proporcionados",
  },
  VAL_ERROR_EMPTY_VALUES: {
    status: 400,
    code: "VAL_ERROR_EMPTY_VALUES",
    message: "Hay campos que son requeridos",
  },
  VAL_ERROR_WRONG_VALUES: {
    status: 400,
    code: "VAL_ERROR_WRONG_VALUES",
    message:
      "Los valores ingresados no cumplen con las validaciones mínimas o son erróneos",
  },
  VAL_ERROR_EMPTY_FILE: {
    status: 400,
    code: "VAL-ERROR-EMPTY-FILE",
    message: "No se puede realizar la petición sin enviar archivos",
  },
  VAL_ERROR_ID: {
    status: 400,
    code: "VAL-ERROR-ID",
    message: `El campo ID no puede estar vacío`,
  },
  MESSAGES: {
    id_required: "El campo 'id' es requerido",
    tribunals_required:
      "Falta enviar algún dato relacionado a ciudad o departamento",
  },
};
export default errorHandler;
