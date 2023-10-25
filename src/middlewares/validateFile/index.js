import { errorHandler } from "../../constants/index.js";
import verifySizeAndTypeFiles from "../../utils/files/index.js";

export const validateFile = (req, res, next) => {
  if (!req.files) {
    return res
      .status(errorHandler.VAL_ERROR_EMPTY_FILE.status)
      .json({ ...errorHandler.VAL_ERROR_EMPTY_FILE, details: null });
  }

  const files = Object.entries(req.files);

  let hasError = false;

  for (let [_key, value] of files) {
    if (Array.isArray(value)) {
      value.forEach((data) => {
        if (hasError) {
          return;
        }
        const result = verifySizeAndTypeFiles(data);
        if (result?.status === 415 || result?.status === 413) {
          hasError = true;
          return res.status(result?.status).json({
            status: result?.status,
            code:
              result?.status === 415
                ? "UNSUPPORTED-MEDIA-TYPE"
                : "PAYLOAD-TOO-LARGE",
            message:
              result?.status === 415
                ? `Formato de archivo no válido. Formatos válidos: ${result?.fileTypes}`
                : `El archivo excede el límite permitido de (${result.size} MB).`,
            details: null,
          });
        }
      });
    } else {
      const result = verifySizeAndTypeFiles(value);
      if (result?.status === 415 || result?.status === 413) {
        hasError = true;
        return res.status(result?.status).json({
          status: result?.status,
          code:
            result?.status === 415
              ? "UNSUPPORTED-MEDIA-TYPE"
              : "PAYLOAD-TOO-LARGE",
          message:
            result?.status === 415
              ? `Formato de archivo no válido. Formatos válidos: ${result?.fileTypes}`
              : `El archivo excede el límite permitido de (${result.size} MB).`,
          details: null,
        });
      }
    }
  }

  if (!hasError) {
    return next();
  }
};
