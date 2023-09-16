import express from "express";
import {
  createVeredict,
  veredictById,
  veredictsAllOrFiltered,
} from "../../controllers/fallos/index.js";

const router = express.Router();

router.get("/", veredictsAllOrFiltered);
router.post("/", createVeredict);
router.get("/:id", veredictById);

export default router;
