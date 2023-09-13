import express from "express";
import personasController from "../controllers/personasController";

const router = express.Router();

router.get("/", personasController.Home_Page);
router.get("/View_ListaPersonas", personasController.View_ListaPersonas);
router.get("/View_ListaLitigantes", personasController.View_ListaLitigantes);
router.get("/View_Litigantes_Docs/", personasController.View_Litigantes_Docs);

// Esperar
router.get("/litigantes_CreateAudiencia", personasController.CreateAudiencia);

export default router;
