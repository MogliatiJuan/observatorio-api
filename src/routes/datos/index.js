import express from "express";
import {
  getAllSinceProvince,
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
router.get("/all", getAllSinceProvince);

export default router;
