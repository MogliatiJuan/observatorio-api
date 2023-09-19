import express from "express";
import datosRouter from "./datos/index.js";
import fallosRouter from "./fallos/index.js";

const router = express.Router();

router.use("/fallo", fallosRouter);
router.use("/datos", datosRouter);

export default router;
