import express from "express";
import {
  createClaims,
  createFactory,
  createSector,
  createTags,
  createTribunals,
  createTypeTrial,
  getAllSinceProvince,
  getCities,
  getClaims,
  getCurrencies,
  getDepartments,
  getFactories,
  getProvinces,
  getSector,
  getTags,
  getTribunals,
  getTypeTrial,
  modifiyClaims,
  modifiyFactory,
  modifiySector,
  modifiyTags,
  modifiyTribunals,
  modifiyTypeTrial,
} from "../../controllers/index.js";
const router = express.Router();

router.get("/ciudades", getCities);
router.get("/provincias", getProvinces);
router.get("/departamentos", getDepartments);
router.get("/all", getAllSinceProvince);
router.get("/empresas", getFactories);
router.post("/empresas", createFactory);
router.patch("/empresas/:id", modifiyFactory);
router.get("/etiquetas", getTags);
router.post("/etiquetas", createTags);
router.patch("/etiquetas/:id", modifiyTags);
router.get("/juzgados", getTribunals);
router.post("/juzgados", createTribunals);
router.patch("/juzgados/:id", modifiyTribunals);
router.get("/reclamos", getClaims);
router.post("/reclamos", createClaims);
router.patch("/reclamos/:id", modifiyClaims);
router.get("/rubros", getSector);
router.post("/rubros", createSector);
router.patch("/rubros/:id", modifiySector);
router.get("/tipojuicio", getTypeTrial);
router.post("/tipojuicio", createTypeTrial);
router.patch("/tipojuicio/:id", modifiyTypeTrial);
router.get("/divisas", getCurrencies);

export default router;
