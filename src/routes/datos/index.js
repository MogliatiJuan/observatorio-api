import express from "express";
import {
  getAll,
  getCities,
  getDepartments,
  getProvinces,
  getTribunals,
} from "../../controllers/index.js";

const router = express.Router();

router.get("/ciudades", getCities);
router.get("/provincias", getProvinces);
router.get("/departamentos", getDepartments);
router.get("/juzgados", getTribunals);
router.get("/all", getAll);

export default router;
