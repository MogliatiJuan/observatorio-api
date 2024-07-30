import express from "express";
import datosRouter from "./datos/index.js";
import fallosRouter from "./fallos/index.js";
import auth from "./auth/index.js";

const router = express.Router();

router.use("/fallo", fallosRouter);
router.use("/datos", datosRouter);
router.use("/auth", auth);

export default router;
