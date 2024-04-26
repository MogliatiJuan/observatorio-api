import express from "express";
import {
  createVeredict,
  deleteVeredict,
  modifyVeredict,
  restoreVeredict,
  veredictById,
  veredictsAllOrFiltered,
} from "../../controllers/fallos/index.js";
import { validateFile } from "../../middlewares/validateFile/index.js";

const router = express.Router();

router.get("/", veredictsAllOrFiltered);
router.post("/", validateFile, createVeredict);
router.get("/:id", veredictById);
router.put("/:id", modifyVeredict);
router.delete("/:id", deleteVeredict);
router.post("/restore/:id", restoreVeredict);

export default router;
