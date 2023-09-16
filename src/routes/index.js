import express from "express";
import varios_router from "../modules/varios/router_varios.js";
import fallosRouter from "./fallos/index.js";

const router = express.Router();

router.use("/fallo", fallosRouter);
router.use("/varios", varios_router);

export default router;
