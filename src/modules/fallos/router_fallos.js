import express from "express";
import controller from "./controller_fallos.js";

const router = express.Router();

router.get("/", controller.all);
router.get("/filtro/fallo", controller.readByFilter);
router.get("/:id", controller.read);
router.post("/", controller.create);

export default router;
