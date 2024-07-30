import express from "express";
import {
  createVeredict,
  deleteVeredict,
  modifyVeredict,
  restoreVeredict,
  veredictById,
  veredictsAllOrFiltered,
} from "../../controllers/fallos/index.js";
import { adminMiddleware, validateFile } from "../../middlewares/index.js";

const router = express.Router();

router.get("/", veredictsAllOrFiltered);
router.post("/", validateFile, createVeredict);
router.get("/:id", veredictById);
router.put("/:id", adminMiddleware, modifyVeredict); //modificar middleware para cuando se agregue los colaboradores, estos mismos puedan modificar su fallo subido
router.delete("/:id", adminMiddleware, deleteVeredict);
router.post("/restore/:id", adminMiddleware, restoreVeredict);

export default router;
