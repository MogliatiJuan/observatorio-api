import express from "express";
import controller from "./controller_varios.js";

const router = express.Router();

router.get("/ciudades", controller.getCiudades);
router.get("/provincias", controller.getProvincias);
router.get("/fueros", controller.getFueros);
router.get("/fueros_x_juzgados", controller.getFuerosXJuzgados);
router.get("/departamentos", controller.getDepartamentos);
router.get("/dependencias", controller.getDependencias);
router.get("/juzgados", controller.getJuzgados);

export default router;
